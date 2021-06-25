declare module 'slash2'
declare module '*.css'
declare module '*.less'
declare module '*.scss'
declare module '*.sass'
declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'
declare module 'omit.js'

// google analytics interface
type GAFieldsObject = {
  eventCategory: string
  eventAction: string
  eventLabel?: string
  eventValue?: number
  nonInteraction?: boolean
}

type Window = {
  ga: (
    command: 'send',
    hitType: 'event' | 'pageview',
    fieldsObject: GAFieldsObject | string,
  ) => void
  reloadAuthorized: () => void
}

// preview.pro.ant.design only do not use in your production 
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
declare let ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: 'site' | undefined

declare const REACT_APP_ENV: 'test' | 'dev' | 'pre' | false

declare type AO = Record<any, any>
declare type AnyObj = Record<any, any>
declare type AF<P = any[], R = any> = (...rest: P) => R
declare type AnyFunc<P = any[], R = any> = (...rest: P) => R

declare interface Pagination<Item> {
  current: number
  pages: number
  records: Item[]
  size: number
  total: number


  /* 新增重命名 */
  pageSize: number
  data: Item[]
}

declare interface QueryPagination {
  current?: number
  pageSize?: number
}

declare interface AuthorityTree {
  /** 这里的key 是值path的id值，在config/constant.ts.RoutesEnum定义  */
  key: number
  title: string
  children?: AuthorityTree[]
  buttonAuthority?: AuthorityTree[]
}


declare interface BTN<T> {
  title: T
  key: string
}

declare interface RouterConfig {
  path: string
  componenet: string
  icon: string,
  component: './Consult',
  routes: RouterConfig[],
  buttonAuthority?: BTN[],
}

declare namespace API {
  export interface CurrentUser {
    name: string
    /** key：路由, value: 按钮权限  */
    adminPath: AO
    roleId: string
    roleName: string
  }
}