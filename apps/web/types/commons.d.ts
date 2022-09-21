// 字典选项
declare type LabelValueOption<T = string> = {
  label: string
  value: T
}

// 字典选项集
declare type LabelValueOptions<T = string> = ReadonlyArray<LabelValueOption<T>>
