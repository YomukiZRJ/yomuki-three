import { CineonToneMapping, PCFSoftShadowMap, WebGLRenderer, sRGBEncoding } from 'three'
import Experience from './Experience'
export default class Renderder{
  instance: WebGLRenderer
  experience: Experience
  constructor () {
    this.experience = new Experience()
    this.#setRenderder()
  }

  #setRenderder () {
    this.instance = new WebGLRenderer({
      canvas: this.experience.canvas,
      antialias: true
    })
    this.resize()
    this.instance.setClearColor('#211d20')
    this.instance.shadowMap.enabled = true
    this.instance.shadowMap.type = PCFSoftShadowMap
    this.instance.physicallyCorrectLights = true
    this.instance.outputEncoding = sRGBEncoding
    this.instance.toneMapping = CineonToneMapping
    this.instance.toneMappingExposure = 1.75
  }

  resize () {
    this.instance.setSize(this.experience.sizes.widht, this.experience.sizes.height)
    this.instance.setPixelRatio(this.experience.sizes.pixelRatio)
  }

  update () {
    this.instance.render(this.experience.scene, this.experience.camera.instance)
  }

  destory () {
    this.instance.dispose()
  }
}
