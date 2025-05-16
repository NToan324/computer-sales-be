import OrderModel, { Order } from '@/models/order.model';
import { CreatedResponse, OkResponse } from '@/core/success.response'
import { BadRequestError } from '@/core/error.response'
import elasticsearchService from '@/services/elasticsearch.service';
import CartModel from '@/models/cart.model';
import UserModel from '@/models/user.model';
import authService from './auth.service';
import ProductVariantModel from '@/models/productVariant.model';
// import mailQueue from '@/queue/mail.queue';

class OrderService {
    // Tìm kiếm đơn hàng theo các tiêu chí
    async searchOrder({
        customer_name,
        order_id,
        status,
        payment_status,
        payment_method,
        from_date,
        to_date,
        page = 1,
        limit = 10,
    }: {
        customer_name?: string;
        order_id?: string;
        status?: string;
        payment_status?: string;
        payment_method?: string;
        from_date?: string;
        to_date?: string;
        page?: number;
        limit?: number;
    }) {
        const must: any[] = [];

        // Tìm kiếm theo tên khách hàng
        if (customer_name) {
            must.push({
                wildcard: {
                    'user_name.keyword': {
                        value: `*${customer_name}*`,
                        case_insensitive: true,
                    },
                },
            });
        }

        // Tìm kiếm theo order_id
        if (order_id) {
            must.push({
                term: {
                    _id: order_id,
                },
            });
        }

        // Tìm kiếm theo trạng thái đơn hàng
        if (status) {
            must.push({
                term: {
                    status: status,
                },
            });
        }

        // Tìm kiếm theo trạng thái thanh toán
        if (payment_status) {
            must.push({
                term: {
                    payment_status: payment_status,
                },
            });
        }

        // Tìm kiếm theo phương thức thanh toán
        if (payment_method) {
            must.push({
                term: {
                    payment_method: payment_method,
                },
            });
        }

        // Lọc theo khoảng thời gian
        if (from_date || to_date) {
            const from = from_date ? new Date(from_date) : undefined;
            const to = to_date ? new Date(to_date) : undefined;

            const fromISO = from ? from.toISOString() : undefined;
            const toISO = to ? to.toISOString() : undefined;

            must.push({
                range: {
                    createdAt: {
                        ...(from_date && { gte: fromISO }),
                        ...(to_date && { lte: toISO }),
                    },
                },
            });
        }

        const from = (page - 1) * limit;

        // Cấu hình query Elasticsearch
        const query: any = {
            from,
            size: limit,
            query: {
                bool: {
                    must,
                },
            },
            sort: [
                {
                    createdAt: {
                        order: 'desc', // Sắp xếp theo thời gian tạo (mới nhất trước)
                    },
                },
            ],
        };

        // Thực hiện tìm kiếm trong Elasticsearch
        const { total, response } = await elasticsearchService.searchDocuments(
            'orders',
            query
        );

        if (total === 0) {
            return new OkResponse('No order found', [])
        }

        // Xử lý kết quả trả về
        const orders = response.map((hit: any) => ({
            _id: hit._id,
            ...hit._source,
        }));

        const pageNumber = parseInt(page.toString(), 10);
        const limitNumber = parseInt(limit.toString(), 10);

        return {
            total,
            page: pageNumber,
            limit: limitNumber,
            totalPages: Math.ceil((total ?? 0) / limit),
            data: orders,
        };
    }

    async createOrder({
        user_id,
        user_name,
        email,
        coupon_code,
        address,
        items,
        payment_method,
    }: {
        user_id?: string;
        user_name?: string;
        email?: string;
        coupon_code?: string;
        address: string;
        items?: {
            product_variant_id: string;
            product_variant_name: string;
            quantity: number;
            price: number;
            discount?: number;
        }[];
        payment_method: string;
    }) {
        let cartItems = items || []; // Danh sách sản phẩm trong giỏ hàng
        let discountAmount = 0;
        let cart: any[] = [];

        // Trường hợp có `user_id`
        if (user_id) {
            // Lấy danh sách items từ giỏ hàng trong Elasticsearch
            const cartResponse = await elasticsearchService.searchDocuments('carts', {
                query: {
                    term: {
                        user_id,
                    },
                },
            });

            const { total: totalCart, response } = cartResponse;

            if (totalCart === 0) {
                throw new BadRequestError('Cart is empty');
            }

            cart = response;

            cartItems = (cart[0] as { _id: string, _source: { items: any[] } })._source.items;
        }

        // Lấy danh sách product_variant_id từ giỏ hàng
        const productVariantIds = cartItems.map((item: any) => item.product_variant_id);

        // Search các sản phẩm trong index product_variants
        const { total: totalProducts, response: products } = await elasticsearchService.searchDocuments('product_variants', {
            query: {
                bool: {
                    must: [
                        {
                            terms: {
                                _id: productVariantIds,
                            },
                        },
                    ],
                    filter: [
                        {
                            term: {
                                isActive: true,
                            },
                        },
                    ],
                },
            },
        });

        if (totalProducts === 0) {
            throw new BadRequestError('Products not found');
        }

        const productMap = new Map();
        products.forEach((product: any) => {
            productMap.set(product._id, product._source);
        });

        let flagChangePrice = false;

        // Kiểm tra thông tin sản phẩm và cập nhật nếu cần
        for (const item of cartItems) {
            const product = productMap.get(item.product_variant_id);

            if (!product) {
                throw new BadRequestError(`Product with ID ${item.product_variant_id}, Name ${item.product_variant_name} not found or not available`);
            }

            // Kiểm tra giá và discount
            if (item.price !== product.price || item.discount !== product.discount) {
                // Cập nhật lại giá và discount trong giỏ hàng
                item.price = product.price;
                item.discount = product.discount;

                flagChangePrice = true;
            }

            // Kiểm tra số lượng sản phẩm
            if (item.quantity > product.quantity) {
                throw new BadRequestError(`Product ${item.product_variant_name} does not have enough stock`);
            }
        }

        // Kiểm tra trạng thái sản phẩm
        if (flagChangePrice && user_id) {
            // Cập nhật lại giá và discount trong Elasticsearch
            await elasticsearchService.updateDocument('carts', cart[0]._id, {
                items: cartItems,
            });

            // Cập nhật lại giá và discount trong giỏ hàng của người dùng trong MongoDB
            await CartModel.findByIdAndUpdate(cart[0]._id, {
                items: cartItems,
            });

            throw new BadRequestError(`Product information has changed. Please review your cart.`);
        }

        // Kiểm tra coupon_code nếu có
        if (coupon_code) {
            const { total: totalCoupons, response: coupons } = await elasticsearchService.searchDocuments('coupons', {
                query: {
                    bool: {
                        must: [
                            {
                                term: {
                                    code: coupon_code,
                                },
                            },
                        ],
                        filter: [
                            {
                                term: {
                                    isActive: true,
                                },
                            },
                        ],
                    }
                },
            });

            if (totalCoupons === 0) {
                throw new BadRequestError('Invalid coupon code');
            }

            const coupon: any = coupons[0]._source;

            if (coupon.usage_count >= coupon.usage_limit) {
                throw new BadRequestError('Coupon usage limit has been reached');
            }

            discountAmount = coupon.discount_amount || 0;
        }

        let loyalty_points_used = 0;
        if (user_id) {
            const user = await UserModel.findById(user_id);

            loyalty_points_used = user?.loyalty_points || 0;
        }

        // Tính tổng tiền
        const totalAmount = cartItems.reduce(
            (sum: number, item: any) => sum + item.quantity * item.price * (1 - (item.discount || 0)),
            0
        ) - discountAmount - (loyalty_points_used * 1000); // Giả sử 1 điểm thưởng = 1000đ

        const loyalty_points_earned = totalAmount * 0.1; // 10% số tiền đơn hàng sẽ được quy đổi thành điểm thưởng


        // Tạo tài khoản người dùng nếu không có
        if (!user_id) {
            if (!user_name || !email) {
                throw new BadRequestError('User name and email are required');
            }

            if (email) {
                const existingUser = await UserModel.findOne({ email });

                if (existingUser) {
                    user_id = existingUser._id.toString();
                }
                else {
                    // Tạo tài khoản người dùng mới với mật khẩu ngẫu nhiên
                    const randomPassword = Math.random().toString(36).slice(-8); // Mật khẩu ngẫu nhiên

                    const newUser = await authService.signup({
                        email,
                        fullName: user_name,
                        password: randomPassword,
                    });

                    user_id = newUser.id.toString();
                }
            }
        }

        // Tạo đơn hàng trong MongoDB
        const order = await OrderModel.create({
            user_id,
            user_name,
            email,
            coupon_code,
            address,
            items: cartItems,
            total_amount: totalAmount,
            discount_amount: discountAmount,
            loyalty_points_used,
            loyalty_points_earned,
            payment_method,
        });

        const { _id, ...orderWithoutId } = order.toObject();

        // Thêm đơn hàng vào Elasticsearch
        await elasticsearchService.indexDocument('orders', order._id.toString(), orderWithoutId);

        // Cập nhật lại số lượng sản phẩm trong Elasticsearch
        for (const item of cartItems) {
            await elasticsearchService.updateDocument('product_variants', item.product_variant_id, {
                quantity: productMap.get(item.product_variant_id).quantity - item.quantity,
            });

            // Cập nhật lại số lượng sản phẩm trong MongoDB
            await ProductVariantModel.findByIdAndUpdate(item.product_variant_id, {
                quantity: productMap.get(item.product_variant_id).quantity - item.quantity,
            });
        }

        // Xóa giỏ hàng của người dùng trong Elasticsearch và MongoDB
        if (user_id) {
            await elasticsearchService.deleteDocument('carts', cart[0]._id);
            await CartModel.findByIdAndDelete(cart[0]._id);
        }

        // Cập nhật lại số điểm thưởng cho người dùng
        if (user_id) {
            await UserModel.findByIdAndUpdate(user_id, {
                loyalty_points: loyalty_points_earned,
            });

            await elasticsearchService.updateDocument('users', user_id, {
                loyalty_points: loyalty_points_earned,
            });
        }

        // Dùng message queue để gửi email thông báo đơn hàng
        // Enqueue email sending task
        // await mailQueue.addEmailTask({
        //     to: email,
        //     subject: 'Order Confirmation',
        //     text: `Thank you for your order, ${user_name}. Your order ID is ${order._id}.`,
        // });

        return
    }

    // Lấy danh sách đơn hàng
    async getOrders({
        page = 1,
        limit = 10,
    }: {
        page?: number;
        limit?: number;
    }) {
        const skip = (page - 1) * limit;

        const orders = await OrderModel.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }); // Sắp xếp theo thời gian tạo (mới nhất trước)

        const total = await OrderModel.countDocuments();

        return {
            total,
            page,
            limit,
            orders,
        };
    }

    // Lấy chi tiết đơn hàng theo order_id
    async getOrderById(order_id: string) {
        const order = await OrderModel.findById(order_id);

        if (!order) {
            throw new Error('Order not found');
        }

        return order.toObject();
    }

    // Cập nhật trạng thái đơn hàng
    async updateOrderStatus(order_id: string, status: string) {
        const validStatuses = ['PENDING', 'SHIPPING', 'DELIVERED', 'CANCELLED'];

        if (!validStatuses.includes(status)) {
            throw new Error('Invalid status');
        }

        const order = await OrderModel.findById(order_id);

        if (!order) {
            throw new Error('Order not found');
        }

        // Thêm trạng thái mới vào order_tracking
        order.order_tracking.push({
            status,
            updated_at: new Date(),
        });

        // Cập nhật trạng thái hiện tại
        // order.status = status;

        await order.save();

        return order.toObject();
    }
}

const orderService = new OrderService();
export default orderService;