import { tickKey } from './event-bus-key'
const { emit } = useEventBus(tickKey)
export default class ThreeTime{
  /**
     * 开始时间戳
     */
  start: number
  /**
     * 当前时间戳
     */
  current: number
  /**
   * 距离上一次帧动画的时间
   */
  //   delta = 0
  delta = 16
  constructor () {
    this.start = Date.now()
    this.current = this.start
    window.requestAnimationFrame(() => {
      this.#tick()
    })
  }

  #tick () {
    const currentTime = Date.now()
    this.delta = currentTime - this.current
    this.current = currentTime
    // console.log(this.delta)

    emit('tick')
    window.requestAnimationFrame(() => {
      this.#tick()
    })
  }

  /**
   * 流逝的时间戳
   */
  get elapsed () {
    return this.current - this.start
  }
}
