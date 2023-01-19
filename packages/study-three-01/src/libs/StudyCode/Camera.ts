import { PerspectiveCamera } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Experience from './Experience'

export default class Camera{
  experience
  instance: PerspectiveCamera | null
  controls: OrbitControls | null
  constructor () {
    this.experience = new Experience()
    this.#setInstance()
    this.#setOrbitControls()
  }

  get size () {
    return this.experience.sizes
  }

  get scene () {
    return this.experience.scene
  }

  get canvas () {
    return this.experience.canvas
  }

  resize () {
    this.instance.aspect = this.size.aspect
    this.instance?.updateProjectionMatrix()
  }

  update () {
    this.controls?.update()
  }

  #setInstance () {
    this.instance = new PerspectiveCamera(
      35,
      this.size.aspect,
      0.1,
      100
    )
    this.instance.position.set(6, 4, 8)
    this.scene.add(this.instance)
  }

  /**
 * 设置轨道控制器
 */
  #setOrbitControls () {
    this.controls = new OrbitControls(this.instance, this.canvas)
    this.controls.target.set(0, 0.75, 0)
    this.controls.enableDamping = true
  }
}
