import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default (width = window.innerWidth, height = window.innerHeight) => {
  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(width, height)
  renderer.setClearColor(0xB9D3FF, 1)
  document.body.appendChild(renderer.domElement)
  const scene = new THREE.Scene()
  const aspect = width / height
  const camera = new THREE.PerspectiveCamera(45, aspect, 1, 1000)
  camera.position.set(200, 200, 200)
  camera.lookAt(scene.position)
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.addEventListener('change', () => {
    render()
  })
  function render () {
    renderer.render(scene, camera)
  }
  /**
   * 辅助坐标
   */
  const axesHelper = new THREE.AxesHelper(250)
  scene.add(axesHelper)

  const light = new THREE.PointLight(0x000000)
  light.position.set(200, 200, 200)
  light.intensity = 0.5 // 修改光的强度
  light.distance = 9999 // 修改光的照射范围
  light.decay = 1 // 修改衰减度
  scene.add(light)

  /**
   * 使用 BufferGeometry 创建几何体
   * 这个用起来更接近于WebGL JSAPI
   */
  const geometry = new THREE.BufferGeometry()
  // 6个顶点坐标
  const vertices = new Float32Array([
    0,
    0,
    0, // 顶点1坐标
    80,
    0,
    0, // 顶点2坐标
    80,
    80,
    0, // 顶点3坐标
    0,
    80,
    0 // 顶点4坐标
  ])
  // 6个顶点颜色
  const colors = new Float32Array([
    1,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    1,
    1,
    1,
    0,
    0,
    1,
    1,
    1,
    0,
    1
  ])
  // 6个顶点法向量
  const normals = new Float32Array([
    0,
    0,
    1, // 顶点1法向量
    0,
    0,
    1, // 顶点2法向量
    0,
    0,
    1, // 顶点3法向量
    0,
    0,
    1 // 顶点4法向量
  ])
  // 顶点索引数据
  const indexes = new Uint16Array([
    0,
    1,
    2,
    0,
    2,
    3
  ])
  // 设置自定义几何体的位置属性，3个为一组（3个表示一个顶点坐标）
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
  // 设置自定义几何体的颜色属性，3个为一组（3个表示一个顶点坐标）
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  // 设置自定义几何体的法向量属性
  geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3))
  geometry.index = new THREE.BufferAttribute(indexes, 1)
  // 添加自定义顶点的网格
  const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
    color: 0x0000FF,
    // vertexColors: true,
    side: THREE.DoubleSide // 两面可见
  }))
  scene.add(mesh)
  // 添加自定义几何体的点模型
  const points = new THREE.Points(geometry, new THREE.PointsMaterial({
    // color: 0x0000FF,
    size: 10.0,
    vertexColors: true // 开启顶点着色
  }))
  scene.add(points)
  // 添加自定义几何体的线模型
  const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({
    color: 0xFF0000
  }))
  scene.add(line)

  render()
  return {
    render
  }
}
