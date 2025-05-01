import z from 'zod'

export class AuthValidation {
  static signupSchema() {
    return {
      body: z.object({
        email: z.string().email('Email is not valid').nonempty('Email is required'),
        password: z.string().nonempty('Password is required').min(6, 'Password must be at least 6 characters long'),
        address: z.string().nonempty('Address is required'),
        phone: z
          .string()
          .min(10, 'Phone number must be at least 10 characters long')
          .nonempty('Phone number is required'),
        fullName: z.string().nonempty('User name is required')
      })
    }
  }

  static loginSchema() {
    return {
      body: z
        .object({
          email: z.string().email('Email is not valid'),          
          password: z.string().nonempty('Password is required')
        })
    }
  }

  static forgotPasswordSchema() {
    return {
      body: z.object({
        email: z.string().email('Email is not valid')
      })
    }
  }

  static verifyOtp() {
    return {
      body: z.object({
        id: z.string().nonempty('User ID is required'),
        otp_code: z.string().nonempty('OTP code is required')
      }),
    }
  }

  static forgotPasswordReset() {
    return {
      body: z.object({
        id: z.string().nonempty('User ID is required'),
        new_password: z.string().nonempty('New password is required')
      }),
    }
  }
  
  static resetPassword() {
    return {
      body: z.object({
        id: z.string().nonempty('User ID is required'),
        old_password: z.string().nonempty('old password is required'),
        new_password: z.string().nonempty('new password is required')
      }),
    }
  }
}