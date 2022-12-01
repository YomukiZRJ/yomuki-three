import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
/**
 * 创建场景对象Scene
 */
const scene = new THREE.Scene()

/**
 * 创建一个立方体几何对象和材质对象，并用此创建网格模型对象，在场景中添加
 */
const geometry = new THREE.BoxGeometry(100, 100, 100)// 立方体
const material = new THREE.MeshLambertMaterial({ // 材质
  color: 0x0000FF,
  transparent: true,
  opacity: 0.5
})
const mesh = new THREE.Mesh(geometry, material)// 网格模型
mesh.position.set(150, 50, 150)
scene.add(mesh)

/**
 * 创建一个球体（不太完整）
 */
const sphereGeometry = new THREE.SphereGeometry(100, 25, 10, 0, Math.PI, 0, Math.PI)
const sphereMaterial = new THREE.MeshLambertMaterial({
  color: 0xFF0000,
  wireframe: true // 是否渲染为线框
})
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphereMesh.position.set(-150, -50, 150)
scene.add(sphereMesh)

/**
 * 创建一个圆柱体
 */
const cylinderGeometry = new THREE.CylinderGeometry(20, 40, 100, 32)
const cylindeMaterial = new THREE.MeshPhongMaterial({
  color: 0x0000FF,
  specular: 0x4488EE, // 高光颜色
  shininess: 50
})
const cylindeMesh = new THREE.Mesh(cylinderGeometry, cylindeMaterial)
cylindeMesh.position.set(-150, 200, 100)
scene.add(cylindeMesh)
/**
 * 创建一个点光源，设置它的位置，并在场景中添加
 */
const point = new THREE.PointLight(0xFFFFFF)
point.position.set(400, 200, 300)
scene.add(point)

/**
 * 创建一个环境光，并在场景中添加
 */
const ambient = new THREE.AmbientLight(0x444444)
scene.add(ambient)

/**
 * 创建辅助坐标轴
 */
const axesHelper = new THREE.AxesHelper(250)
scene.add(axesHelper)

/**
 * 创建相机
 */
const width = window.innerWidth
const height = window.innerHeight
const aspect = width / height // 窗口宽高比
const s = 300 // 三维场景显示范围控制系数，系数越大，显示的范围越大
const camera = new THREE.OrthographicCamera(-s * aspect, (s * aspect), s, -s, 1, 1000)
camera.position.set(200, 300, 200) // 设置相机位置
camera.lookAt(scene.position) // 设置相机方向(指向的场景对象)

/**
 * 创建渲染器
 */
const renderer = new THREE.WebGLRenderer()
renderer.setSize(width, height)// 设置渲染区域尺寸
renderer.setClearColor(0xB9D3FF, 1) // 设置背景颜色
document.body.appendChild(renderer.domElement) // body元素中插入canvas对象

const controls = new OrbitControls(camera, renderer.domElement) // 轨道控制器

let lastDate = new Date()
function render () {
  const nowDate = new Date()
  const diff = nowDate - lastDate// 获取距离上次渲染的时间差
  lastDate = nowDate
  renderer.render(scene, camera) // 执行渲染操作   指定场景、相机作为参数
  mesh.rotateY(diff * 0.005)// 旋转角度 0.005/ms
  requestAnimationFrame(render)
}
render()
