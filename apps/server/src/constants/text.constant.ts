import { LoggingInterceptor } from '@/interceptors/logging.interceptor'

/**
 * Text constant.
 * @file 文案常量
 * @description 用于全局路由请求的响应文案
 * @module constant/text
 */

export const HTTP_DEFAULT_SUCCESS_TEXT = 'success'
export const HTTP_DEFAULT_FAILED_TEXT = 'fail'

export const HTTP_EXCEPTION_TEXT = {
  BAS_REQUEST: '',
  TOO_MANY_REQUESTS: '请求过多, 请稍后重试',
  UNAUTHORIZED: '请先登录',
  LOGIN_FAIL: '用户名或密码错误',
  INTERNAL_SERVER_ERROR: '服务器内部错误',
  VALIDATION_FAIL: '参数校验失败',
}

export const JWT_ERROR_TEXT = {
  TOKEN_EXPIRED: 'token已过期, 请重新登录',
  JSON_WEB_TOKEN: '无效token',
  NOT_BEFORE: 'token还未生效',
}

// 日志context
export const LOGGER_CONTEXT_TEXT = {
  DATABASE_MODULE: 'DatabaseModule',
  EMAIL_HELPER: 'EmailHelper',
  LOGGING_INTERCEPTOR: 'LoggingInterceptor',
  HTTP_EXCEPTION_FILTER: 'HttpExceptionFilter',
  EXCEPTION_INTERCEPTOR: 'ExceptionInterceptor',
}
