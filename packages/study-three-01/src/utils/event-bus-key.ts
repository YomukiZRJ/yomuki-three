import type { EventBusKey } from '@vueuse/core'
import type { Ref } from 'vue'
/**
 * three-resize 事件数据类型
 */
export interface threeResizeEvent {
  width: Ref<number>
  height: Ref<number>
  pixelRatio: Ref<number>
}
/**
 * three-resize 事件key
 */
export const threeResizeKey: EventBusKey<threeResizeEvent> = Symbol('three-resize')
