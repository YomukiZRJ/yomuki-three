/*
 * @Desc: 真实渲染
 */
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { createDirectionalLightGui } from '../helper/guiHelper'
import useGui from '../hooks/useGui'

export default (
  canvasEl: Ref<HTMLCanvasElement>,
  width: Ref<number>,
  height: Ref<number>
) => {
  /**
   * 创建gui对象
   */
  const { gui } = useGui()
  const debugProp = {
    envMapIntensity: 5
  }

  const aspect = computed(() => width.value / height.value)
  const scene = new THREE.Scene()
  scene.add(new THREE.AxesHelper(20))

  /**
   * 环境地图
   */
  const cubeTextureLoader = new THREE.CubeTextureLoader()
  const envMapTexture = cubeTextureLoader.setPath('../assets/environmentMaps/0/').load([
    'px.jpg', // 正x
    'nx.jpg', // 负x
    'py.jpg', // 正y
    'ny.jpg', // 负y
    'pz.jpg', // 正z
    'nz.jpg'// 负z
  ])
  /**
   * 修改环境贴图的输出模式
   */
  envMapTexture.encoding = THREE.sRGBEncoding
  /**
   * 设置场景背景
   */
  scene.background = envMapTexture
  /**
   * 设置场景中所有物理材质的环境贴图
   */
  scene.environment = envMapTexture

  /**
   * 更新场景中所有的材质
   */
  const updateAllMeterials = () => {
    scene.traverse((obj) => {
      // console.log(obj)
      if (obj instanceof THREE.Mesh && obj.material instanceof THREE.MeshStandardMaterial)
        updateMeterials(obj)
    })
  }
  const updateMeterials = (mesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>) => {
    // mesh.material.envMap = envMapTexture
    mesh.material.envMapIntensity = debugProp.envMapIntensity
    // mesh.material.needsUpdate = true
    mesh.castShadow = true
    mesh.receiveShadow = true
  }
  gui.add(debugProp, 'envMapIntensity').min(0)
    .max(10)
    .step(0.1)
    .onChange(updateAllMeterials)

  /**
   * 引入模型
   */
  const gltfLoader = new GLTFLoader()
  gltfLoader.load('../assets/models/hamburger.glb', (gltf) => {
    gltf.scene.scale.set(0.1, 0.1, 0.1)
    scene.add(gltf.scene)
    updateAllMeterials()
  })
  // gltfLoader.load('../assets/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
  //   gltf.scene.scale.set(10, 10, 10)
  //   gltf.scene.position.set(0, -3, 0)
  //   gltf.scene.rotation.y = Math.PI * 0.5
  //   scene.add(gltf.scene)

  //   gui.add(gltf.scene.rotation, 'y').min(-Math.PI)
  //     .max(Math.PI)
  //     .name('模型y轴转动')
  //   updateAllMeterials()
  // })

  /**
   * 灯光
   */
  const directionLight = new THREE.DirectionalLight('#fff', 3)
  directionLight.castShadow = true
  directionLight.position.set(0.25, 3, -2.25)
  directionLight.shadow.camera.far = 10
  directionLight.shadow.mapSize.set(1024, 1024)
  /**
   * 定义用于查询阴影映射的位置沿对象法线偏移多少
   * 增加这个值可以用来减少阴影痤疮，特别是在大型场景中，光照射到几何在一个浅的角度。代价是阴影可能会显得扭曲。
   */
  directionLight.shadow.normalBias = 0.05
  scene.add(directionLight)
  // scene.add(new THREE.CameraHelper(directionLight.shadow.camera))
  gui.add(directionLight, 'intensity').min(0)
    .max(20)
    .step(0.001)
    .name('灯光强度')
  gui.add(directionLight.position, 'x').min(-5)
    .max(5)
    .step(0.001)
    .name('灯x')
  gui.add(directionLight.position, 'y').min(-5)
    .max(5)
    .step(0.001)
    .name('灯y')
  gui.add(directionLight.position, 'z').min(-5)
    .max(5)
    .step(0.001)
    .name('灯x')
  /**
   * camera
   */
  const camera = new THREE.PerspectiveCamera(75, aspect.value, 0.1, 100)
  camera.position.set(4, 1, -4)
  scene.add(camera)
  /**
   * renderer
   */
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasEl,
    antialias: true
  })
  renderer.setSize(width.value, height.value)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // 设置像素比
  renderer.setClearColor('#00000f')

  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap
  /**
   * 物理灯光
   */
  renderer.physicallyCorrectLights = true

  /**
   * 设置渲染器输出编码
   * THREE.LinearEncoding 默认的
   * THREE.sRGBEncoding
   * THREE.BasicDepthPacking
   * THREE.RGBADepthPacking
   */
  renderer.outputEncoding = THREE.sRGBEncoding

  /**
   * 设置渲染器的色调映射
   * THREE.NoToneMapping default
   * THREE.LinearToneMapping
   * THREE.ReinhardToneMapping
   * THREE.CineonToneMapping
   * THREE.ACESFilmicToneMapping
   */
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.5

  gui.add(renderer, 'physicallyCorrectLights').name('是否开启物理灯光')
  gui.add(
    renderer,
    'toneMapping',
    {
      No: THREE.NoToneMapping,
      Linear: THREE.LinearToneMapping,
      Reinhard: THREE.ReinhardToneMapping,
      Cineon: THREE.CineonToneMapping,
      ACESFilmic: THREE.ACESFilmicToneMapping
    }).onFinishChange(() => {
    // updateAllMeterials()
  })
  gui.add(renderer, 'toneMappingExposure').min(0)
    .max(5)
    .step(0.01)
    .name('曝光度')
  /**
   * controls
   */
  const controls = new OrbitControls(camera, canvasEl)
  controls.target.set(0, 0.75, 0)
  controls.enableDamping = true

  /**
 * 动画
 */
  const clock = new THREE.Clock()
  let oldTime = 0
  const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldTime
    oldTime = elapsedTime

    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
  }

  tick()
  const handleResize = () => {
    renderer.setSize(width.value, height.value)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    camera.aspect = aspect.value
    camera.updateProjectionMatrix()
  }
  window.addEventListener('resize', handleResize)
}
