async createOrder({
    user_id,
    coupon_code,
    address,
    payment_method,
}: {
    user_id?: string;
    coupon_code?: string;
    address: string;
    payment_method: string;
}) {
    if (!user_id) {
        throw new BadRequestError('User ID is required to create an order');
    }

    // Lấy danh sách items từ giỏ hàng
    const cartResponse = await elasticsearchService.searchDocuments('carts', {
        query: {
            term: {
                user_id,
            },
        },
    });

    const { total: totalCart, response: cart } = cartResponse;

    if (totalCart === 0 || !cart || cart.length === 0) {
        throw new BadRequestError('Cart is empty');
    }

    const cartItems = cart[0]._source.items;

    // Lấy danh sách product_variant_id từ giỏ hàng
    const productVariantIds = cartItems.map((item: any) => item.product_variant_id);

    // Search các sản phẩm trong index product_variants
    const { total: totalProducts, response: products } = await elasticsearchService.searchDocuments('product_variants', {
        query: {
            terms: {
                _id: productVariantIds,
            },
        },
    });

    if (totalProducts === 0) {
        throw new BadRequestError('No products found in product_variants index');
    }

    const productMap = new Map();
    products.forEach((product: any) => {
        productMap.set(product._id, product._source);
    });

    // Kiểm tra thông tin sản phẩm và cập nhật nếu cần
    for (const item of cartItems) {
        const product = productMap.get(item.product_variant_id);

        if (!product) {
            throw new BadRequestError(`Product with ID ${item.product_variant_id} not found`);
        }

        // Kiểm tra giá và discount
        if (item.unit_price !== product.price || item.discount !== product.discount) {
            // Cập nhật lại giá và discount trong giỏ hàng
            item.unit_price = product.price;
            item.discount = product.discount;

            // Cập nhật giỏ hàng trong Elasticsearch
            await elasticsearchService.indexDocument('carts', cart[0]._id, {
                ...cart[0]._source,
                items: cartItems,
            });

            throw new BadRequestError(`Product information has changed. Please review your cart.`);
        }

        // Kiểm tra số lượng sản phẩm
        if (item.quantity > product.stock) {
            throw new BadRequestError(`Product ${item.product_variant_name} does not have enough stock`);
        }
    }

    // Kiểm tra coupon_code nếu có
    let discountAmount = 0;
    if (coupon_code) {
        const { total: totalCoupons, response: coupons } = await elasticsearchService.searchDocuments('coupons', {
            query: {
                term: {
                    code: coupon_code,
                },
            },
        });

        if (totalCoupons === 0) {
            throw new BadRequestError('Invalid coupon code');
        }

        const coupon = coupons[0]._source;

        if (!coupon.isActive) {
            throw new BadRequestError('Coupon is not active');
        }

        if (coupon.usage_count >= coupon.usage_limit) {
            throw new BadRequestError('Coupon usage limit has been reached');
        }

        discountAmount = coupon.discount_amount || 0;
    }

    // Tính tổng tiền
    const totalAmount = cartItems.reduce(
        (sum: number, item: any) => sum + item.quantity * item.unit_price * (1 - (item.discount || 0)),
        0
    ) - discountAmount;

    // Tạo đơn hàng trong MongoDB
    const order = await OrderModel.create({
        user_id,
        coupon_code,
        address,
        items: cartItems,
        total_amount: totalAmount,
        discount_amount: discountAmount,
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

    const orderObject = order.toObject();

    // Thêm đơn hàng vào Elasticsearch
    await elasticsearchService.indexDocument('orders', order._id.toString(), orderObject);

    return orderObject;
}