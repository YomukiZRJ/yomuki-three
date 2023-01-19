
import type { AnimationAction, Group } from 'three'
import { AnimationMixer, Mesh } from 'three'
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import Experience from '../Experience'
export default class Floor{
  experience = new Experience()
  model: Group
  animation: {
    mixer: null | AnimationMixer
    foxAction: AnimationAction | null
  } = {
      mixer: null,
      foxAction: null
    }

  constructor () {
    this.#setModel()
    this.#setAnimation()
  }

  #setModel () {
    this.model = this.models.scene
    this.model.scale.set(0.02, 0.02, 0.02)
    this.model.traverse((child) => {
      if (child instanceof Mesh)
        child.castShadow = true
    })
    this.scene.add(this.model)
  }

  #setAnimation () {
    this.animation.mixer = new AnimationMixer(this.model)
    this.animation.foxAction = this.animation.mixer.clipAction(this.models.animations[0])
    this.animation.foxAction.play()
  }

  update () {
    // console.log(this.deltaTime)

    if (this.animation.mixer) this.animation.mixer.update(this.deltaTime * 0.001)
  }

  get models () {
    return this.experience.resources.items.get('foxModel') as GLTF
  }

  get scene () {
    return this.experience.scene
  }

  get deltaTime () {
    return this.experience.time.delta
  }
}
