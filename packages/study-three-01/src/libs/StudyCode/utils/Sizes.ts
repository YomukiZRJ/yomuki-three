import { resizeKey } from './event-bus-key'

const { emit } = useEventBus(resizeKey)
export default class Sizes{
  widht: number
  height: number
  pixelRatio: number
  constructor () {
    this.#setSizes()
    window.addEventListener('resize', () => {
      this.#setSizes()
      emit('resize')
    })
  }

  removeListener () {

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
