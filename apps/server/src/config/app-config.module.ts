import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import * as Joi from '@hapi/joi'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`../../.env.${process.env.NODE_ENV}`],
      validationSchema: Joi.object({
        // NODE_ENV: Joi.string().valid(['development', 'production', 'test']).default('development'),
        NODE_ENV: Joi.string().default('development'),
        APP_PORT: Joi.number().default(3000),
        EMAIL_AUTH_USER: Joi.string().required(),
        EMAIL_AUTH_PASS: Joi.string().required(),
        DB_TYPE: Joi.string().default('mysql'),
        DB_HOST: Joi.string().default('127.0.0.1'),
        DB_PORT: Joi.number().default(3306),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
      }),
      expandVariables: true,
    }),
  ],
})
export class AppConfigModule {}
