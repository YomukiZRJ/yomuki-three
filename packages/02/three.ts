import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
export default () => {
  const scene = new THREE.Scene()
  // 相机
  const width = window.innerWidth
  const height = window.innerHeight
  const aspect = width / height
  const s = 300
  const camera = new THREE.OrthographicCamera(-s * aspect, (s * aspect), s, -s, 1, 1000)
  camera.position.set(200, 300, 200)
  camera.lookAt(scene.position)
  // 几何体
  const geometry = new THREE.BoxGeometry(40, 100, 40)// 立方体
  const material = new THREE.MeshLambertMaterial({ // 材质
    color: 0x0000FF
  })
  const mesh = new THREE.Mesh(geometry, material)// 网格模型
  mesh.castShadow = true // 渲染阴影
  scene.add(mesh)
  // 平面 （用来当地板显示下阴影）
  const plane = new THREE.PlaneGeometry(1000, 1000)
  const planeMaterial = new THREE.MeshLambertMaterial({ color: 0x999999 })
  const planeMesh = new THREE.Mesh(plane, planeMaterial)
  planeMesh.rotateX(-Math.PI / 2) // 旋转网格模型
  planeMesh.position.y = -50
  planeMesh.receiveShadow = true // 材质接收阴影
  scene.add(planeMesh)
  // 渲染器
  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(width, height)// 设置渲染区域尺寸
  renderer.setClearColor(0xB9D3FF, 1) // 设置背景颜色
  renderer.shadowMap.enabled = true // 开启阴影渲染
  document.body.appendChild(renderer.domElement) // body元素中插入canvas对象
  function render () {
    renderer.render(scene, camera) // 执行渲染操作   指定场景、相机作为参数
  }
  // 轨道控制器
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.addEventListener('change', render)// 监听鼠标、键盘事件
  render()

  /**
 * 创建一个点光源，设置它的位置
 */
  const point = new THREE.PointLight(0xFFFFFF)
  point.position.set(400, 200, 300)
  point.intensity = 0.5 // 修改光的强度
  point.distance = 9999 // 修改光的照射范围
  point.decay = 1 // 修改衰减度
  point.castShadow = true
  /**
   * 添加点光源
   */
  function addPointLight () {
    scene.add(point)
    render()
  }
  /**
   * 移除点光源
   */
  function removePointLight () {
    scene.remove(point)
    render()
  }

  /**
    * 创建一个环境光
    */
  const ambient = new THREE.AmbientLight(0x444444)
  /**
   * 添加环境光
   */
  function addAmbientLight () {
    scene.add(ambient)
    render()
  }
  /**
       * 移除环境光
       */
  function removeAmbientLight () {
    scene.remove(ambient)
    render()
  }

  /**
   * 创建一个平行光
   */
  const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1)
  directionalLight.position.set(60, 100, 40)
  // directionalLight.target = mesh
  directionalLight.castShadow = true
  directionalLight.shadow.camera.near = 0.5
  directionalLight.shadow.camera.far = 300
  directionalLight.shadow.camera.left = -50
  directionalLight.shadow.camera.right = 50
  directionalLight.shadow.camera.top = 200
  directionalLight.shadow.camera.bottom = -100
  /**
   * 添加平行光
   */
  function addDirectionalLight () {
    scene.add(directionalLight)
    render()
  }
  /**
           * 移除平行光
           */
  function removeDirectionalLight () {
    scene.remove(directionalLight)
    render()
  }

  /**
   * 创建一个聚光灯
   */
  const spotLight: THREE.SpotLight = new THREE.SpotLight(0xFFFFFF)
  spotLight.position.set(50, 90, 50)
  spotLight.intensity = 2 // 设置光照强度
  spotLight.distance = 300 // 光源距离
  spotLight.angle = Math.PI / 6 // (Math.PI / 4 为90度) 光线散射角度，最大为Math.PI / 2
  spotLight.penumbra = 0 // 聚光锥的半影衰减百分比。0-1.默认0 (用来设置光亮和不亮地方的过渡效果)
  spotLight.decay = 1// 衰减量

  // 将 target 绑定为一个三维对象，以此改变光的照射方向
  // const spotLightTarget: THREE.Object3D = new THREE.Object3D()
  // spotLightTarget.position.set(-100, -100, 0)
  // spotLight.target = spotLightTarget
  // scene.add(spotLightTarget)

  // 将 target 绑定在某个模型对象上 就可以追踪这个对象了
  // spotLight.target = mesh

  spotLight.castShadow = true
  spotLight.shadow.camera.near = 1
  spotLight.shadow.camera.far = 300
  spotLight.shadow.camera.fov = 20

  /**
   * 添加聚光灯
   */
  function addSpotLight () {
    scene.add(spotLight)
    render()
  }
  /**
   * 移除聚光灯
   */
  function removeSpotLight () {
    scene.remove(spotLight)
    render()
  }

  const hemisphereLight = new THREE.HemisphereLight(0xFFFFBB, 0x080820, 1)

  /**
   * 添加半球光
   */
  function addHemisphereLight () {
    scene.add(hemisphereLight)
    render()
  }
  /**
   * 移除半球光
   */
  function removeHemisphereLight () {
    scene.remove(hemisphereLight)
    render()
  }
  return {
    addPointLight, removePointLight, addAmbientLight, removeAmbientLight, addDirectionalLight, removeDirectionalLight, addSpotLight, removeSpotLight, addHemisphereLight, removeHemisphereLight
  }
}
