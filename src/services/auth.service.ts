import { BadRequestError, ForbiddenError } from '@/core/error.response'
import { CreatedResponse, OkResponse } from '@/core/success.response'
import userModel, { User } from '@/models/user.model'
import otpModel from '@/models/otp.model'
import bcrypt from 'bcryptjs'
import jwt, { JwtPayload } from 'jsonwebtoken'
import dotenv from 'dotenv'
import emailConfig from '@/config/email'
dotenv.config()

class AuthService {
  async signup(payload: Partial<User>) {
    const {fullName, email, phone, address, password, role } = payload
    const isPhoneNumberExist = await userModel.exists({ phone })
    const isEmailExist = await userModel.exists({ email })
    if (isEmailExist) {
      throw new BadRequestError('Email already exists')
    }
    if (isPhoneNumberExist) {
      throw new BadRequestError('Phone number already exists')
    }

    const newUser = await userModel.create({
      fullName,
      email,
      phone,
      address,
      password,
      role
    })

    const userResponse = {
      id: newUser._id,
      phone: newUser.phone,
      email: newUser.email,
      name: newUser.fullName, 
      role: newUser.role,
      loyaltyPoint: newUser.loyalty_points,
    }

    return new CreatedResponse('User created successfully', userResponse)
  }

  async login(data: { email: string; password: string }) {
    const { email, password } = data
    const foundUser = await userModel.findOne({email})
    if (!foundUser) {
      throw new BadRequestError('User not found')
    }
    if (!foundUser.isActive) {
      throw new ForbiddenError('Account is not active');
    }
    const isPasswordMatch = await bcrypt.compare(password, foundUser.password)
    if (!isPasswordMatch) {
      throw new BadRequestError('Password is incorrect')
    }
    //check if user is active

    const accessToken = jwt.sign(
      {
        id: foundUser._id,
        email: foundUser.email || undefined,
        role: foundUser.role
      },
      process.env.ACCESS_TOKEN_SECRETE as string,
      {
        expiresIn: '1d'
      }
    )

    const user = {
      id: foundUser._id,
      phone: foundUser.phone,
      name: foundUser.fullName,
      role: foundUser.role,
      point: foundUser.loyalty_points,
    }
    return { accessToken, user }
  }

  async forgotPassword( email: string ) {
    let findUser = await userModel.findOne({ email })
    if (!findUser) {
      throw new BadRequestError('User not found')
    }
    
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()

    //send email
    if (email) {
      const mailOptions = emailConfig.mailOptions({ email, otpCode })
      const sendMail = await emailConfig.transporter.sendMail(mailOptions)
      if (!sendMail) {
        throw new BadRequestError('Error sending email')
      }
    }
    
    const otp = await otpModel.create({
      user_id: findUser._id,
      otp_code: otpCode,
      expiration: new Date(Date.now() + 2 * 60 * 1000),
      is_verified: false
    })

    return new OkResponse('Get OTP successfully', otp)
  }

  async verifyOtp({ otp_code, id }: { otp_code: string; id: string }) {
    const user = await userModel.findOne({
      _id: id
    })

    console.log('user', user)

    if (!user) {
      throw new BadRequestError('User not found')
    }

    // Tìm OTP theo user_id và otp_code, sắp xếp theo thời gian tạo mới nhất
    const otpRecord = await otpModel
      .findOne({
        user_id: user._id,
        otp_code
      })
      .sort({ created_at: -1 })

    if (!otpRecord) {
      throw new BadRequestError('OTP code is not valid')
    }

    if (otpRecord.expiration < new Date()) {
      throw new BadRequestError('OTP code is expired')
    }

    if (otpRecord.is_verified) {
      throw new BadRequestError('OTP code is already verified')
    }

    otpRecord.is_verified = true
    await user.save()
    await otpRecord.save()

    return new OkResponse('Verify OTP successfully', otpRecord)
  }
  async forgotPasswordReset({ password, id }: { password: string; id: string }) {
    const user = await userModel.findOne({
      _id: id
    })
    if (!user) {
      throw new BadRequestError('User not found')
    }
    // Kiểm tra OTP đã được xác thực hay chưa
    const otp = await otpModel.findOne({
      user_id: user._id,
      is_verified: true,
      expiration: { $gt: new Date() }
    })

    if (!otp) {
      throw new BadRequestError('OTP is not verified or expired')
    }

    //check if password is old password
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (isPasswordMatch) {
      throw new BadRequestError('New password must be different from old password')
    }

    // Cập nhật mật khẩu
    user.password = password
    user.isActive = true
    await user.save()

    // Xoá OTP sau khi đổi mật khẩu (tuỳ ý)
    await otpModel.deleteMany({ user_id: user._id })

    return new OkResponse('Password has been reset successfully')
  }

}

const authService = new AuthService()
export default authService
