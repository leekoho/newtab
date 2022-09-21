/**
 * @description: Exception related enumeration
 */
export enum ExceptionEnum {
  Unauthorized = 401,

  // page not access
  PAGE_NOT_ACCESS = 403,

  // page not found
  PAGE_NOT_FOUND = 404,

  // error
  InternalServerError = 500,
}
