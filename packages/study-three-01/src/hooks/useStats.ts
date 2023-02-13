
import Stats from 'stats.js'
export default () => {
  const stats = new Stats()
  stats.showPanel(0, 1, 2) // 0: fps, 1: ms, 2: mb, 3+: custom
  // stats.showPanel(1)
  // stats.showPanel(2)
  document.body.appendChild(stats.dom)
  function animate () {
    stats.begin()

    // monitored code goes here

    stats.end()

    requestAnimationFrame(animate)
  }

  requestAnimationFrame(animate)
}
