/*
 * @Desc: 纹理 textures
 */
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import colorImageUrl from '../assets/textures/door/color.jpg'
import alphaImageUrl from '../assets/textures/door/alpha.jpg'
import ambientOcclusionImageUrl from '../assets/textures/door/ambientOcclusion.jpg'
export default (
  canvasEl: Ref<HTMLCanvasElement>,
  width: Ref<number>,
  height: Ref<number>
) => {
  const aspect = computed(() => width.value / height.value)
  const scene = new THREE.Scene()
  const group = new THREE.Group()
  scene.add(group)

  /**
   * 使用原生载入图片资源
   */
  // const colorImage = new Image() // 创建颜色纹理图片对象
  // const colorTexture = new THREE.Texture(colorImage) // 创建颜色纹理对象
  // colorImage.src = colorImageUrl // 载入图片
  // colorImage.addEventListener('load', () => {
  //   colorTexture.needsUpdate = true // 图片载入成功的时候 ，设置needsUpdate为true，将在下次使用纹理时触发更新
  // })

  /**
   * 使用loader加载文件
   */
  // const textureLoader = new THREE.TextureLoader()
  // const colorTexture = textureLoader.load(colorImageUrl, () => {
  //   console.log('loading finished')
  // }, () => {
  //   // onProgress 进度条目前不支持了
  //   console.log('loading progressing')
  // }, () => {
  //   console.log('loading error')
  // })

  /**
   * 使用载入管理来载入资源
   * 用于统一管理资源载入的状态处理
   */
  const loadingManager = new THREE.LoadingManager()
  const textureLoader = new THREE.TextureLoader(loadingManager)
  loadingManager.onStart = () => {
    console.log('loading started')
  }
  loadingManager.onLoad = () => {
    console.log('loading finished')
  }
  loadingManager.onProgress = () => {
    console.log('loading progressing')
  }
  loadingManager.onError = () => {
    console.log('loading error')
  }
  const colorTexture = textureLoader.load(colorImageUrl)

  /**
   * 材质中设置刚才创建的颜色纹理
   */
  const material = new THREE.MeshBasicMaterial({
    map: colorTexture // 颜色贴图
  })

  const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    material
  )
  group.add(cube1)
  const camera = new THREE.PerspectiveCamera(75, aspect.value, 0.1, 100)
  camera.position.z = 3
  scene.add(camera)
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasEl
  })
  renderer.setSize(width.value, height.value)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // 设置像素比

  const controls = new OrbitControls(camera, canvasEl)
  controls.enableDamping = true

  const tick = () => {
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
  }
  tick()
  /**
   * 处理窗口大小变更
   */
  const handleResize = () => {
    renderer.setSize(width.value, height.value)
    camera.aspect = aspect.value // 重新赋值照相机的aspect
    camera.updateProjectionMatrix() // 更新投影矩阵
  }
  window.addEventListener('resize', handleResize)
}
