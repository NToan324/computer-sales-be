import categoryService from '@/services/category.service'
import statisticService from '@/services/statistic.service'
import type { Request, Response } from 'express'

class StatisticController {
    async getOverview(req: Request, res: Response) {
        res.send(await statisticService.getOverview())
    }
}



const statisticController = new StatisticController()
export default statisticController
