import { GUI } from 'lil-gui'
export default () => {
  const gui = new GUI({ closed: false })
  onBeforeUnmount(() => {
    gui.destroy()
  })
  return {
    gui
  }
}
