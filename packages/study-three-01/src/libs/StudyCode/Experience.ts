import Sizes from './utils/Sizes'
import Time from './utils/Time'
import Camera from './Camera'
import Renderer from './Renderer'
import World from './World/World'
import Resources from './utils/Resources'
import { resizeKey, tickKey } from './utils/event-bus-key'
import { Scene } from 'three'
import source from './source'
import Debug from './utils/Debug'
const { on: onResize } = useEventBus(resizeKey)
const { on: onTick } = useEventBus(tickKey)
/**
 * 用来存放首次构建的Experience对象。同等于 这个class只能被new一次。
 */
let instance = null
export default class Experience{
  canvas: HTMLCanvasElement
  sizes: Sizes
  time: Time
  scene: Scene
  camera: Camera
  renderder: Renderer
  resources: Resources
  world
  debug
  unsubscribeResize
  unsubscribeTick
  constructor (canvas: HTMLCanvasElement) {
    if (instance)
      return instance
    instance = this /* eslint-disable-line @typescript-eslint/no-this-alias */
    this.canvas = canvas
    this.sizes = new Sizes()
    this.time = new Time()
    this.scene = new Scene()
    this.resources = new Resources(source)
    this.camera = new Camera()
    this.renderder = new Renderer()
    this.world = new World()
    this.debug = new Debug()
    this.unsubscribeResize = onResize(() => {
      this.#resize()
    })
    this.unsubscribeTick = onTick(() => {
      this.#update()
    })
  }

  /**
   * 注销订阅事件
   */
  unsubscribe () {
    this.unsubscribeResize && this.unsubscribeResize()
    this.unsubscribeTick && this.unsubscribeTick()
  }

  /**
   * 处理窗口变更
   */
  #resize () {
    this.camera.resize()
    this.renderder.resize()
  }

  /**
   * 处理帧动画
   */
  #update () {
    this.world?.update()
    this.camera.update()
    this.renderder.update()
  }
}
