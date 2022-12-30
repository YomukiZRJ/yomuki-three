/*
 * @Desc: 材质
 */
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
export default (
  canvasEl: Ref<HTMLCanvasElement>,
  width: Ref<number>,
  height: Ref<number>
) => {
  const gui = new dat.GUI({ closed: false })
  const aspect = computed(() => width.value / height.value)
  const scene = new THREE.Scene()
  const group = new THREE.Group()
  scene.add(group)

  const loadingManager = new THREE.LoadingManager()
  const textureLoader = new THREE.TextureLoader(loadingManager)
  const colorTexture = textureLoader.load('../assets/textures/door/color.jpg')
  const alphaTexture = textureLoader.load('../assets/textures/door/alpha.jpg')
  const ambientOcclusionTexture = textureLoader.load('../assets/textures/door/ambientOcclusion.jpg')
  const heightTexture = textureLoader.load('../assets/textures/door/height.jpg')
  const matalnessTexture = textureLoader.load('../assets/textures/door/metalness.jpg')
  const normalTexture = textureLoader.load('../assets/textures/door/normal.jpg')
  const roughnessTexture = textureLoader.load('../assets/textures/door/roughness.jpg')
  const matcapTexture = textureLoader.load('../assets/matcaps/1.png')

  const gradientTexture = textureLoader.load('../assets/gradients/3.jpg')
  gradientTexture.minFilter = THREE.NearestFilter
  gradientTexture.magFilter = THREE.NearestFilter
  gradientTexture.generateMipmaps = false

  const baseMaterial = new THREE.MeshBasicMaterial()
  // 改变颜色
  // baseMaterial.color.set('red')
  // baseMaterial.color = new THREE.Color('blue')
  baseMaterial.map = colorTexture
  // baseMaterial.wireframe = true // 线框
  baseMaterial.transparent = true // 开启后才能让 opacity 和 alphaMap起效果
  // baseMaterial.opacity = 0.4
  baseMaterial.alphaMap = alphaTexture
  /**
   * 可见面
   * THREE.FrontSide 默认值 正面
   * THREE.BackSide 反面
   * THREE.DoubleSide 双面 更多的gpu计算
   */
  baseMaterial.side = THREE.DoubleSide

  /**
   * 法线网格材质
   * 什么是法线？物体外侧的向量方向（关乎到关照，反射）
   * 一般用于调试法线
   */
  const normalMaterial = new THREE.MeshNormalMaterial()
  // normalMaterial.flatShading = true // 是否使用平面着色进行渲染

  /**
   * 根据法线选择正确的颜色。
   * 根据纹理图片渲染明暗，在没有光源的情况下，物体也会呈现出明暗面
   */
  const matcapMaterial = new THREE.MeshMatcapMaterial()
  matcapMaterial.matcap = matcapTexture
  matcapMaterial.side = THREE.DoubleSide

  /**
   * 深度网格材质
   * 深度基于相机远近平面。白色最近，黑色最远。
   */
  const depthMaterial = new THREE.MeshDepthMaterial()

  /**
   * 光照有效
   * 非光泽表面
   */
  const lambertMaterial = new THREE.MeshLambertMaterial()

  /**
   * 光照有效
   * 光泽表面、高光材质
   */
  const phongMaterial = new THREE.MeshPhongMaterial()
  phongMaterial.shininess = 100 // 越高越来
  phongMaterial.specular = new THREE.Color('red') // 高光颜色

  /**
   *卡通阴影效果的材质
   */
  const toonMaterial = new THREE.MeshToonMaterial()
  toonMaterial.gradientMap = gradientTexture

  /**
   * 标准材质，PBR 物理材质，精准和逼真，计算成本高
   */
  const standardMaterial = new THREE.MeshStandardMaterial()
  // standardMaterial.metalness = 0.45 // 金属程度
  standardMaterial.metalnessMap = matalnessTexture
  // standardMaterial.roughness = 0.45 // 粗糙程度,0-1 0是光滑
  standardMaterial.roughnessMap = roughnessTexture
  standardMaterial.map = colorTexture
  standardMaterial.aoMap = ambientOcclusionTexture// 环境遮挡纹理 需要复制下uv
  standardMaterial.aoMapIntensity = 1 // 环境遮挡强度
  standardMaterial.displacementMap = heightTexture// 位移纹理。需要足够多的顶点
  standardMaterial.displacementScale = 0.05
  standardMaterial.normalMap = normalTexture
  standardMaterial.normalScale.set(0.5, 0.5)
  standardMaterial.transparent = true
  standardMaterial.alphaMap = alphaTexture

  // gui.add(standardMaterial, 'metalness').max(1)
  //   .min(0)
  //   .step(0.0001)
  // gui.add(standardMaterial, 'roughness').max(1)
  //   .min(0)
  //   .step(0.0001)
  // gui.add(standardMaterial, 'aoMapIntensity').max(10)
  //   .min(0)
  //   .step(0.5)
  // gui.add(standardMaterial, 'displacementScale').max(1)
  //   .min(0)
  //   .step(0.0001)

  /**
   * 载入环境贴图
   * 使用立方体纹理载入
   */
  const cubeTextureLoader = new THREE.CubeTextureLoader()
  // const envMapTexture = cubeTextureLoader.load([
  //   '../assets/environmentMaps/0/px.jpg',
  //   '../assets/environmentMaps/0/nx.jpg',
  //   '../assets/environmentMaps/0/py.jpg',
  //   '../assets/environmentMaps/0/ny.jpg',
  //   '../assets/environmentMaps/0/pz.jpg',
  //   '../assets/environmentMaps/0/nz.jpg'
  // ])
  const envMapTexture = cubeTextureLoader.setPath('../assets/environmentMaps/1/').load([
    'px.jpg', // 正x
    'nx.jpg', // 负x
    'py.jpg', // 正y
    'ny.jpg', // 负y
    'pz.jpg', // 正z
    'nz.jpg'// 负z
  ])

  const standard2Material = new THREE.MeshStandardMaterial()
  standard2Material.metalness = 0.7
  standard2Material.roughness = 0.2// 越紧接近0，越光滑，反射的环境越清晰
  standard2Material.envMap = envMapTexture
  gui.add(standard2Material, 'metalness').max(1)
    .min(0)
    .step(0.0001)
  gui.add(standard2Material, 'roughness').max(1)
    .min(0)
    .step(0.0001)

  const sphereMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 64, 64),
    standard2Material
  )
  sphereMesh.position.x = -1.5
  sphereMesh.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphereMesh.geometry.attributes.uv.array, 2))
  group.add(sphereMesh)

  const planeMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 2, 100, 100),
    standard2Material
  )
  // 复制一下uv坐标
  planeMesh.geometry.setAttribute('uv2', new THREE.BufferAttribute(planeMesh.geometry.attributes.uv.array, 2))
  group.add(planeMesh)

  const torusMesh = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.5, 64, 128),
    standard2Material
  )
  torusMesh.position.x = 2.5
  torusMesh.geometry.setAttribute('uv2', new THREE.BufferAttribute(torusMesh.geometry.attributes.uv.array, 2))
  group.add(torusMesh)

  const camera = new THREE.PerspectiveCamera(75, aspect.value, 0.1, 100)
  camera.position.z = 3
  scene.add(camera)

  /**
   * 环境光
   */
  const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5)
  scene.add(ambientLight)
  /**
   * 点光源
   */
  const pointLight = new THREE.PointLight(0xFFFFFF, 0.5)
  pointLight.position.set(2, 3, 4)
  scene.add(pointLight)

  const renderer = new THREE.WebGLRenderer({
    canvas: canvasEl
  })
  renderer.setSize(width.value, height.value)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // 设置像素比

  const controls = new OrbitControls(camera, canvasEl)
  controls.enableDamping = true

  const clock = new THREE.Clock()
  const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    // update object
    sphereMesh.rotation.y = 0.1 * elapsedTime
    torusMesh.rotation.y = 0.1 * elapsedTime
    planeMesh.rotation.y = 0.1 * elapsedTime
    sphereMesh.rotation.x = 0.15 * elapsedTime
    torusMesh.rotation.x = 0.15 * elapsedTime
    planeMesh.rotation.x = 0.15 * elapsedTime

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
