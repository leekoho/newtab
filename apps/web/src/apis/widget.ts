import instance from '@/plugins/axios'

export interface WidgetModel {
  id: string
  name: string
  path: string
  componentPath: string
  icon: string
  sort: number
  intro: string
}
