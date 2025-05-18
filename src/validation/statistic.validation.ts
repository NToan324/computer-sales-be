import z from 'zod'

export class StatisticValidation {
    static getAdvancedStatistics() {
        return {
            query: z.object({
                from_date: z.string().date('Invalid date format'),
                to_date: z.string().date('Invalid date format'),
            }).strict('Invalid field'),
        }
    }
}
