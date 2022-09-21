import { ConfigService } from '@nestjs/config'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

export const databaseProviders = [
  TypeOrmModule.forRootAsync({
    imports: [],
    inject: [ConfigService],
    useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
      const isProd = configService.get<string>('NODE_ENV') === 'production'
      return {
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        // entities: ['dist/**/**.entity{.ts,.js}'],
        autoLoadEntities: true,
        charset: 'utf8mb4_general_ci',
        logging: false,
        synchronize: !isProd,
        // 命名策略  驼峰转下划线
        namingStrategy: new SnakeNamingStrategy(),
      }
    },
  }),
]
