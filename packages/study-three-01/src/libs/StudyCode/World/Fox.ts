
import type { GUI } from 'lil-gui'
import type { AnimationAction, Group } from 'three'
import { AnimationMixer, Mesh } from 'three'
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import Experience from '../Experience'

enum ActionType {
  Idle,
  Walking,
  Running
}
export default class Floor{
  experience = new Experience()
  model: Group
  animation: {
    mixer?: AnimationMixer
    action?: {
      [ActionType.Idle]?: AnimationAction
      [ActionType.Walking]?: AnimationAction
      [ActionType.Running]?: AnimationAction
    }
    current?: AnimationAction
    paly?: () => void
  } = {
      mixer: null,
      action: {}
    }

  debugObject: {
    playIdle?: () => void
    playWalking?: () => void
    playRunning?: () => void
  } = {}

  debugFolder: GUI
  constructor () {
    this.#setModel()
    this.#setAnimation()
    this.#setDebug()
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
    if (this.models.animations.length === 3){
      this.animation.mixer = new AnimationMixer(this.model)
      const [idle = null, walking = null, running = null] = this.models.animations
      this.animation.action[ActionType.Idle] = this.animation.mixer.clipAction(idle)
      this.animation.action[ActionType.Walking] = this.animation.mixer.clipAction(walking)
      this.animation.action[ActionType.Running] = this.animation.mixer.clipAction(running)
      this.animation.current = this.animation.action[ActionType.Idle]
      this.animation.current.play()
      /**
       * 动画过渡切换
       */
      this.animation.paly = (name: ActionType) => {
        const newAction = this.animation.action[name]
        if (newAction){
          const oldAction = this.animation.current
          newAction.reset()
          newAction.play()
          newAction.crossFadeFrom(oldAction, 1)
          this.animation.current = newAction
        }
      }

      /**
       * debug
       */
      this.debugObject.playIdle = () => {
        this.animation.paly(ActionType.Idle)
      }
      this.debugObject.playRunning = () => {
        this.animation.paly(ActionType.Running)
      }
      this.debugObject.playWalking = () => {
        this.animation.paly(ActionType.Walking)
      }
    }
  }

  #setDebug () {
    if (!this.debug.gui) return
    this.debugFolder = this.debug.gui.addFolder('fox')
    this.debugFolder.add(this.debugObject, 'playIdle')
    this.debugFolder.add(this.debugObject, 'playWalking')
    this.debugFolder.add(this.debugObject, 'playRunning')
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

  get debug () {
    return this.experience.debug
  }
}
