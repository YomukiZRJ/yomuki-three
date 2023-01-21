import { resizeKey } from './event-bus-key'

const { emit } = useEventBus(resizeKey)
export default class Sizes{
  widht: number
  height: number
  pixelRatio: number
  handleResize = () => {
    this.#setSizes()
    emit('resize')
  }

  constructor () {
    this.#setSizes()
    window.addEventListener('resize', this.handleResize)
  }

  destory () {
    window.removeEventListener('resize', this.handleResize)
  }

  #setSizes () {
    this.widht = window.innerWidth
    this.height = window.innerHeight
    this.pixelRatio = Math.min(window.devicePixelRatio, 2)
  }

  get aspect () {
    return this.widht / this.height
  }
}
