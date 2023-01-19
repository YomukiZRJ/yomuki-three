import type { Ref } from 'vue'
import { threeResizeKey } from '../utils/event-bus-key'
export default (el: Ref<HTMLCanvasElement | null>) => {
  const { emit } = useEventBus(threeResizeKey)
  const { width, height } = useElementSize(el)
  const pixelRatio = useDevicePixelRatio()
  useEventListener(window, 'resize', () => {
    emit({ width, height, pixelRatio })
  })
  return {
    width,
    height,
    pixelRatio
  }
}
