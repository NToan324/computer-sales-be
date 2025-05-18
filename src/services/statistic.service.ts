import elasticsearchService from '@/services/elasticsearch.service';
import { OkResponse } from '@/core/success.response';

class StatisticService {
    // Tổng quan hiệu suất cửa hàng
    async getOverview() {
        // Tổng số người dùng
        const totalUsers = await elasticsearchService.countDocuments('users', {
            query: { match_all: {} },
        });

        // Số lượng người dùng mới (trong 30 ngày qua)
        const newUsers = await elasticsearchService.countDocuments('users', {
            query: {
                range: {
                    createdAt: {
                        gte: 'now-30d/d',
                        lte: 'now/d',
                    },
                },
            },
        });

        // Tổng số đơn đặt hàng
        const totalOrders = await elasticsearchService.countDocuments('orders', {
            query: { match_all: {} },
        });

        // Tổng doanh thu
        const totalRevenueAgg = await elasticsearchService.searchAggregations('orders', {
            size: 0,
            query: {
                range: {
                    createdAt: {
                        gte: 'now-30d/d',
                        lte: 'now/d',
                    },
                },
                aggs: {
                    totalRevenue: {
                        sum: {
                            field: 'total_amount',
                        },
                    },
                },
            },
        });
        const totalRevenue = (totalRevenueAgg?.aggregations?.totalRevenue as { value?: number })?.value || 0;

        // Tổng lợi nhuận
        console.log('totalRevenue', totalRevenue);

        return new OkResponse('Overview statistics retrieved successfully', {
            totalUsers,
            newUsers,
            totalOrders,
            totalRevenue,
        });
    }

    // // Thống kê nâng cao theo thời gian
    // async getAdvancedStatistics({
    //     startDate,
    //     endDate,
    //     interval = 'month', // 'year', 'quarter', 'month', 'week', 'day'
    // }: {
    //     startDate?: string;
    //     endDate?: string;
    //     interval?: 'year' | 'quarter' | 'month' | 'week' | 'day';
    // }) {
    //     const query: any = {
    //         range: {
    //             createdAt: {
    //                 ...(startDate && { gte: startDate }),
    //                 ...(endDate && { lte: endDate }),
    //             },
    //         },
    //     };

    //     // Tổng doanh thu và lợi nhuận
    //     const revenueAndProfitAgg = await elasticsearchService.searchAggregations('orders', {
    //         size: 0,
    //         query,
    //         aggs: {
    //             revenueAndProfit: {
    //                 date_histogram: {
    //                     field: 'createdAt',
    //                     calendar_interval: interval,
    //                 },
    //                 aggs: {
    //                     totalRevenue: {
    //                         sum: {
    //                             field: 'totalAmount',
    //                         },
    //                     },
    //                     totalProfit: {
    //                         sum: {
    //                             field: 'profit',
    //                         },
    //                     },
    //                 },
    //             },
    //         },
    //     });

    //     // Số lượng sản phẩm và chủng loại sản phẩm
    //     const productStatsAgg = await elasticsearchService.searchAggregations('orders', {
    //         size: 0,
    //         query,
    //         aggs: {
    //             productStats: {
    //                 date_histogram: {
    //                     field: 'createdAt',
    //                     calendar_interval: interval,
    //                 },
    //                 aggs: {
    //                     totalProducts: {
    //                         sum: {
    //                             field: 'items.quantity',
    //                         },
    //                     },
    //                     productCategories: {
    //                         terms: {
    //                             field: 'items.category_id.keyword',
    //                             size: 10,
    //                         },
    //                     },
    //                 },
    //             },
    //         },
    //     });

    //     return new OkResponse('Advanced statistics retrieved successfully', {
    //         revenueAndProfit: revenueAndProfitAgg?.aggregations?.revenueAndProfit?.buckets || [],
    //         productStats: productStatsAgg?.aggregations?.productStats?.buckets || [],
    //     });
    // }
}

const statisticService = new StatisticService();
export default statisticService;