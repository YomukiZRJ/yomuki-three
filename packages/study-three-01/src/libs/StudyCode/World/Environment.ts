import type { BufferGeometry, CubeTexture } from 'three'
import { DirectionalLight, Mesh, MeshStandardMaterial, sRGBEncoding } from 'three'
import Experience from '../Experience'
export default class Environment{
  experience
  sunLight
  environmentMap: {
    intensity: number
    texture: CubeTexture | null
  } = {
      intensity: 0.4,
      texture: null
    }

  constructor () {
    this.experience = new Experience()
    this.#setSunLight()
    this.#setEnvironmentMap()
  }

  updateMaterials () {
    this.scene.traverse((child) => {
      if (child instanceof Mesh && child.material instanceof MeshStandardMaterial)
        this.#updateMaterial(child)
    })
  }

  #updateMaterial (mesh: Mesh<BufferGeometry, MeshStandardMaterial>) {
    mesh.material.envMap = this.environmentMap.texture
    mesh.material.envMapIntensity = this.environmentMap.intensity
    mesh.material.needsUpdate = true
  }

  /**
   * 设置太阳光
   */
  #setSunLight () {
    this.sunLight = new DirectionalLight()
    this.sunLight.castShadow = true
    this.sunLight.shadow.camera.far = 15
    this.sunLight.shadow.mapSize.set(1024, 1024)
    this.sunLight.shadow.normalBias = 0.05
    this.sunLight.position.set(3.5, 2, -1.25)
    this.scene.add(this.sunLight)
  }

  /**
   * 设置环境地图
   */
  #setEnvironmentMap () {
    this.environmentMap.texture = this.resources.items.get('environmentMapTexture') as CubeTexture | null
    if (this.environmentMap.texture){
      this.environmentMap.texture.encoding = sRGBEncoding
      this.scene.environment = this.environmentMap.texture.encoding
      this.updateMaterials()
    }
  }

  get scene () {
    return this.experience.scene
  }

  get resources () {
    return this.experience.resources
  }
}
