import type { Texture } from 'three'
import { CircleGeometry, Mesh, MeshStandardMaterial, RepeatWrapping, sRGBEncoding } from 'three'
import Experience from '../Experience'
export default class Floor{
  experience = new Experience()
  instance: Mesh<CircleGeometry, MeshStandardMaterial>
  floorColorTexture: Texture
  floorNormalTexture: Texture
  geometry: CircleGeometry
  material: MeshStandardMaterial
  constructor () {
    this.#setGeometry()
    this.#setColorTexture()
    this.#setNormalTexture()
    this.#setMaterial()
    this.#setMesh()
  }

  #setGeometry () {
    this.geometry = new CircleGeometry(5, 64)
  }

  #setColorTexture () {
    this.floorColorTexture = this.resources.items.get('floorColorTexture') as Texture
    this.floorColorTexture.encoding = sRGBEncoding
    this.floorColorTexture.repeat.set(1.5, 1.5)
    this.floorColorTexture.wrapS = RepeatWrapping
    this.floorColorTexture.wrapT = RepeatWrapping
  }

  #setNormalTexture () {
    this.floorNormalTexture = this.resources.items.get('floorNormalTexture') as Texture
    this.floorNormalTexture.repeat.set(1.5, 1.5)
    this.floorNormalTexture.wrapS = RepeatWrapping
    this.floorNormalTexture.wrapT = RepeatWrapping
  }

  #setMaterial () {
    this.material = new MeshStandardMaterial({
      map: this.floorColorTexture,
      normalMap: this.floorNormalTexture
    })
  }

  #setMesh () {
    this.instance = new Mesh(this.geometry, this.material)
    this.instance.rotation.x = -Math.PI * 0.5
    this.instance.receiveShadow = true
    this.scene.add(this.instance)
  }

  get resources () {
    return this.experience.resources
  }

  get scene () {
    return this.experience.scene
  }
}
