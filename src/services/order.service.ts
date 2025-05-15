import OrderModel, { Order } from '@/models/order.model';
import { CreatedResponse, OkResponse } from '@/core/success.response'
import { convertToObjectId } from '@/helpers/convertObjectId'
import { BadRequestError } from '@/core/error.response'
import elasticsearchService from '@/services/elasticsearch.service';

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

        const from = (page - 1) * limit; // Tính toán vị trí bắt đầu

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

        if (total === 0) {
            return {
                total: 0,
                page,
                limit,
                totalPages: 0,
                data: [],
            };
        }

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

    // Tạo đơn hàng
    async createOrder({
        user_id,
        coupon_code,
        address,
        items,
        payment_method,
    }: {
        user_id?: string;
        coupon_code?: string;
        address: string;
        items: {
            product_variant_id: string;
            product_variant_name: string;
            quantity: number;
            price: number;
            discount?: number;
        }[];
        payment_method: string;
    }) {
        const total_amount = items.reduce(
            (sum, item) => sum + item.quantity * item.price * (1 - (item.discount || 0)),
            0
        );

        const order = await OrderModel.create({
            user_id,
            coupon_code,
            address,
            items,
            total_amount,
            payment_method,
            status: 'PENDING',
            payment_status: 'PENDING',
            order_tracking: [
                {
                    status: 'PENDING',
                    updated_at: new Date(),
                },
            ],
        });

        return order.toObject();
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
        order.status = status;

        await order.save();

        return order.toObject();
    }
}

const orderService = new OrderService();
export default orderService;