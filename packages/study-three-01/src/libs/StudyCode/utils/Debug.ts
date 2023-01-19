import { GUI } from 'lil-gui'
export default class Debug{
  active = window.location.hash === '#debug'
  gui: GUI | null
  constructor () {
    console.log(this.active)
    if (this.active)
      this.gui = new GUI({ closed: false })
  }

  destroy () {
    this.gui && this.gui.destroy()
  }
}
