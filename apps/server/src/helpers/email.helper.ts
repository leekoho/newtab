import * as nodemailer from 'nodemailer'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { LOGGER_CONTEXT_TEXT } from '@/constants/text.constant'

// 邮件格式
export interface IEmailOptions {
  to: string
  subject: string
  text: string
  html: string
}

@Injectable()
export class EmailHelper {
  private transporter: nodemailer
  private clientIsValid: boolean

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_AUTH_HOST'),
      secure: true,
      port: this.configService.get<number>('EMAIL_AUTH_POST'),
      auth: {
        user: this.configService.get<string>('EMAIL_AUTH_USER'),
        pass: this.configService.get<string>('EMAIL_AUTH_PASS'),
      },
    })
    this.verifyClient()
  }

  // 验证有效性
  private verifyClient(): void {
    return this.transporter.verify(error => {
      if (error) {
        this.clientIsValid = false
        setTimeout(this.verifyClient.bind(this), 1000 * 60 * 30)
        Logger.error(
          '邮件客户端初始化连接失败！将在半小时后重试：',
          error,
          LOGGER_CONTEXT_TEXT.EMAIL_HELPER
        )
      } else {
        this.clientIsValid = true
        Logger.log('邮件客户端初始化成功！随时可发送邮件', LOGGER_CONTEXT_TEXT.EMAIL_HELPER)
      }
    })
  }

  // 发邮件
  public sendMail(mailOptions: IEmailOptions) {
    if (!this.clientIsValid) {
      Logger.warn('由于未初始化成功，邮件客户端发送被拒绝！', LOGGER_CONTEXT_TEXT.EMAIL_HELPER)
      return false
    }
    // const options = Object.assign(mailOptions, { from: APP_CONFIG.EMAIL.from })
    const options = Object.assign(mailOptions, {
      from: this.configService.get<string>('EMAIL_AUTH_USER'),
    })
    this.transporter.sendMail(options, (error, info) => {
      if (error) {
        Logger.error('邮件发送失败', error, LOGGER_CONTEXT_TEXT.EMAIL_HELPER)
      } else {
        Logger.log('邮件发送成功', info.messageId, info.response, LOGGER_CONTEXT_TEXT.EMAIL_HELPER)
      }
    })
  }
}
