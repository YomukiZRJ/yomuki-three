/*
 * @Desc: 纹理 textures
 */
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import colorImageUrl from '../assets/textures/door/color.jpg'
// import colorImageUrl from '../assets/textures/checkerboard-1024x1024.png' // 放大滤镜测试
import colorImageUrl from '../assets/textures/checkerboard-8x8.png' // 缩小滤镜测试
import alphaImageUrl from '../assets/textures/door/alpha.jpg'
import ambientOcclusionImageUrl from '../assets/textures/door/ambientOcclusion.jpg'
import heightImageUrl from '../assets/textures/door/height.jpg'
import matalnessImageUrl from '../assets/textures/door/metalness.jpg'
import normalImageUrl from '../assets/textures/door/normal.jpg'
import roughnessImageUrl from '../assets/textures/door/roughness.jpg'
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
  loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
    console.log(`Started loading file: ${url}.\nLoaded ${itemsLoaded} of ${itemsTotal} files.`)
  }
  loadingManager.onLoad = () => {
    console.log('loading finished')
  }
  // 载入进度 当前载入的资源地址 已载入数量 总数量
  loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    console.log('loading progressing', 'url', url, 'itemsLoaded', itemsLoaded, 'itemsTotal', itemsTotal)
  }
  loadingManager.onError = (url) => {
    console.log('loading error', url)
  }
  const colorTexture = textureLoader.load(colorImageUrl)
  const alphaTexture = textureLoader.load(alphaImageUrl)
  const ambientOcclusionTexture = textureLoader.load(ambientOcclusionImageUrl)
  const heightTexture = textureLoader.load(heightImageUrl)
  const matalnessTexture = textureLoader.load(matalnessImageUrl)
  const normalTexture = textureLoader.load(normalImageUrl)
  const roughnessTexture = textureLoader.load(roughnessImageUrl)

  /**
   * magFilter 放大滤镜 @see https://threejs.org/docs/index.html?q=Texture#api/zh/constants/Textures
   * 当一个纹素覆盖大于一个像素时，贴图将如何采样
   * THREE.LinearFilter 获取四个最接近的纹素，并在他们之间进行双线性插值。默认值
   * THREE.NearestFilter 使用最接近的纹素的值 。更清晰的，高性能
   */
  colorTexture.magFilter = THREE.NearestFilter

  /**
   * minFilter 缩小滤镜
   * 当一个纹素覆盖小于一个像素时，贴图将如何采样
   * THREE.LinearMipmapLinearFilter 它将使用mipmapping以及三次线性滤镜。默认值
   * 什么是mipmapping？往gpu发送多张不同尺寸的纹理贴图，根据具体显示来决定用哪张
   * THREE.NearestFilter 使用最接近的纹素的值。非常清晰的
   * THREE.LinearFilter 获取四个最接近的纹素，并在他们之间进行双线性插值
   * THREE.NearestMipmapNearestFilter 选择与被纹理化像素的尺寸最匹配的mipmap， 并以NearestFilter（最靠近像素中心的纹理元素）为标准来生成纹理值。
   * THREE.NearestMipmapLinearFilter 选择与被纹理化像素的尺寸最接近的两个mipmap， 并以NearestFilter为标准来从每个mipmap中生成纹理值。最终的纹理值是这两个值的加权平均值。
   * THREE.LinearMipmapNearestFilter 选择与被纹理化像素的尺寸最匹配的mipmap， 并以LinearFilter（最靠近像素中心的四个纹理元素的加权平均值）为标准来生成纹理值。
   * THREE.LinearMipmapLinearFilter 选择与被纹理化像素的尺寸最接近的两个mipmap， 并以LinearFilter为标准来从每个mipmap中生成纹理值。最终的纹理值是这两个值的加权平均值。
   */
  // 当在minFilter上使用不需要mipmaps的滤镜时，可以不要生成mipmaps
  // 如果使用mipmaps，图片大小需要为2的倍数
  colorTexture.generateMipmaps = false
  colorTexture.minFilter = THREE.NearestFilter

  // colorTexture.repeat.x = 2
  // colorTexture.repeat.y = 2
  // colorTexture.repeat.set(2, 3)
  /**
   * 包裹模式
   * THREE.RepeatWrapping 纹理将简单地重复到无穷大
   * THREE.ClampToEdgeWrapping  纹理中的最后一个像素将延伸到网格的边缘。默认值
   * THREE.MirroredRepeatWrapping 纹理将重复到无穷大，在每次重复时将进行镜像
   */
  // 定义了纹理贴图在水平方向上将如何包裹，在UV映射中对应于U
  colorTexture.wrapS = THREE.RepeatWrapping
  // 定义了纹理贴图在垂直方向上将如何包裹，在UV映射中对应于V
  colorTexture.wrapT = THREE.RepeatWrapping

  // 纹理偏移
  // colorTexture.offset.set(0.3, 0.2)

  // 设置纹理的中心点
  // colorTexture.center.set(0.5, 0.5)
  // 如果不设置中心点 默认几何体的左下顶点为旋转轴
  // colorTexture.rotation = Math.PI * 0.25

  /**
   * 材质中设置刚才创建的颜色纹理
   */
  const material = new THREE.MeshBasicMaterial({
    map: colorTexture // 颜色贴图
  })

  const geometry = new THREE.BoxGeometry(1, 1, 1, 5, 5, 5)
  console.log(geometry.attributes.uv) // uv 用于定位纹理如何显示在几何体上
  const cube1 = new THREE.Mesh(
    geometry,
    material
  )
  group.add(cube1)
  const camera = new THREE.PerspectiveCamera(75, aspect.value, 0.1, 100)
  camera.position.z = 2
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
