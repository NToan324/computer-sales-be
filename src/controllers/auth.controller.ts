import type { Request, Response } from 'express'
import authService from '@/services/auth.service'

class AuthController {
  async signup(req: Request, res: Response) {
    const { email, phone, fullName, password, address } = req.body
    res.send(await authService.signup({ email, phone, fullName, password, address }))
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body
    const { accessToken, user } = await authService.login({
      email,
      password
    })

    res.send({ message: 'Login successfully', accessToken, user })
  }

  async forgotPassword(req: Request, res: Response) {
    const payload = req.body
    res.send(await authService.forgotPassword(payload))
  }

  async verifyOtp(req: Request, res: Response) {
    const { otp_code } = req.body
    const { id } = req.query as { id: string }
    res.send(await authService.verifyOtp({ otp_code, id }))
  }

  async forgotPasswordReset(req: Request, res: Response) {
    const { password } = req.body
    const { id } = req.query as { id: string }
    res.send(await authService.forgotPasswordReset({ password, id }))
  }
}
const authController = new AuthController()
export default authController
