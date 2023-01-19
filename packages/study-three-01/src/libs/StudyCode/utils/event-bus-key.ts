import type { EventBusKey } from '@vueuse/core'
export const resizeKey: EventBusKey<string> = Symbol('resize')
export const tickKey: EventBusKey<string> = Symbol('tick')
export const resourcesSuccessKey: EventBusKey<string> = Symbol('resources-success')
