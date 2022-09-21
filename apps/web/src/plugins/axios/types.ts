export interface ErrorsItem {
  property: string
  message: string
}

export interface Result<T = any> {
  name?: string
  message: string
  data: T
  errors: ErrorsItem[]
}
