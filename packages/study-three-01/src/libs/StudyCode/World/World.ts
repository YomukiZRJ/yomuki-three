
import Experience from '../Experience'
import Environment from './Environment'
import { resourcesSuccessKey } from '../utils/event-bus-key'
import Floor from './Floor'
import Fox from './Fox'
const { on: onResourcesSuccess } = useEventBus(resourcesSuccessKey)
export default class World{
  experience = new Experience()
  environment: null | Environment
  floor: null | Floor
  fox: null | Fox
  constructor () {
    onResourcesSuccess(() => {
      this.floor = new Floor()
      this.fox = new Fox()
      this.environment = new Environment()
    })
  }

  update () {
    if (this.fox) this.fox.update()
  }

  get scene () {
    return this.experience.scene
  }

  get resources () {
    return this.experience.resources
  }
}
