import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default (width = window.innerWidth, height = window.innerHeight) => {
  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(width, height)
  renderer.setClearColor(0x000, 1)
  renderer.shadowMap.enabled = true
  document.body.appendChild(renderer.domElement)
  const scene = new THREE.Scene()
  const aspect = width / height
  const camera = new THREE.PerspectiveCamera(45, aspect, 1, 1000)
  camera.position.set(200, 200, 700)
  camera.lookAt(scene.position)
  const axesHelper = new THREE.AxesHelper(700) // 辅助坐标系
  scene.add(axesHelper)
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.addEventListener('change', () => {
    render()
  })
  function render () {
    renderer.render(scene, camera)
  }
  /**
   * 点 Points
   */

  const points = new THREE.Points(
    new THREE.SphereGeometry(50),
    new THREE.PointsMaterial({ color: 0xFFFF00 })
  )
  points.position.set(-100, 100, 100)
  /**
   * 连续的线 Line
   */
  const line = new THREE.Line(
    new THREE.BoxGeometry(50, 50, 50),
    new THREE.LineBasicMaterial({
      color: 0xFFFF00
    })
  )
  /**
   * 组 Group
   */
  const group = new THREE.Group()
  group.add(points, line)
  scene.add(group)
  /**
   * 实例化网格 InstancedMesh
   */
  const instanced = new THREE.InstancedMesh(
    new THREE.BoxGeometry(50, 50, 50),
    new THREE.MeshBasicMaterial({ color: 0xFFFF00, transparent: true, opacity: 0.5 }),
    4
  )
  function setInstancedMatrix (instanced: THREE.InstancedMesh) {
    const matrix = new THREE.Matrix4()
    const position = new THREE.Vector3()
    const rotation = new THREE.Euler()
    const quaternion = new THREE.Quaternion()
    const scale = new THREE.Vector3()
    for (let i = 0; i < instanced.count; i++){
      position.x = Math.random() * 100 - 50
      position.y = Math.random() * 100 - 50
      position.z = Math.random() * 100 - 50
      rotation.x = Math.random() * 2 * Math.PI
      rotation.y = Math.random() * 2 * Math.PI
      rotation.z = Math.random() * 2 * Math.PI
      quaternion.setFromEuler(rotation)
      scale.x = scale.y = scale.z = Math.random() * 1
      matrix.compose(position, quaternion, scale)
      instanced.setMatrixAt(i, matrix)
    }
  }
  setInstancedMatrix(instanced)
  instanced.position.set(-100, 100, 0)
  scene.add(instanced)
  render()
  return {
    render
  }
}
