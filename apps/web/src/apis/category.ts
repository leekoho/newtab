import instance from '@/plugins/axios'
import { WidgetModel } from '@/apis/widget'

export interface CategoryModel {
  id: string
  name: string
  icon: string
  sort: number
}

export interface CategoryWidgetsModel extends CategoryModel {
  widgets: WidgetModel[]
}

enum API {
  List = '/categories',
  WithWidgetList = '/categories_widgets',
}

export const getCategoryList = () => instance.get<CategoryWidgetsModel[]>(API.List)

export const getCategoryWithWidgetList = (): Promise<CategoryWidgetsModel[]> =>
  instance.get(API.WithWidgetList)
