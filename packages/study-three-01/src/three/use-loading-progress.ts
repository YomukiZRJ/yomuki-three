/*
 * @Desc: 载入进度条
 */
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
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
  // Debug
  const debugObject = {}

  const aspect = computed(() => width.value / height.value)
  const scene = new THREE.Scene()

  /**
 * Loaders
 */
  const gltfLoader = new GLTFLoader()
  const cubeTextureLoader = new THREE.CubeTextureLoader()

  /**
 * Update all materials
 */
  const updateAllMaterials = () => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial){
        // child.material.envMap = environmentMap
        child.material.envMapIntensity = debugObject.envMapIntensity
        child.material.needsUpdate = true
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }
  /**
 * Environment map
 */
  const environmentMap = cubeTextureLoader.load([
    '../assets/environmentMaps/0/px.jpg',
    '../assets/environmentMaps/0/nx.jpg',
    '../assets/environmentMaps/0/py.jpg',
    '../assets/environmentMaps/0/ny.jpg',
    '../assets/environmentMaps/0/pz.jpg',
    '../assets/environmentMaps/0/nz.jpg'
  ])

  environmentMap.encoding = THREE.sRGBEncoding

  scene.background = environmentMap
  scene.environment = environmentMap

  debugObject.envMapIntensity = 2.5

  /**
 * Models
 */
  gltfLoader.load(
    '../assets/models/FlightHelmet/glTF/FlightHelmet.gltf',
    (gltf) => {
      gltf.scene.scale.set(10, 10, 10)
      gltf.scene.position.set(0, -4, 0)
      gltf.scene.rotation.y = Math.PI * 0.5
      scene.add(gltf.scene)

      updateAllMaterials()
    }
  )

  /**
 * Lights
 */
  const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
  directionalLight.castShadow = true
  directionalLight.shadow.camera.far = 15
  directionalLight.shadow.mapSize.set(1024, 1024)
  directionalLight.shadow.normalBias = 0.05
  directionalLight.position.set(0.25, 3, -2.25)
  scene.add(directionalLight)

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
  renderer.physicallyCorrectLights = true
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.toneMapping = THREE.ReinhardToneMapping
  renderer.toneMappingExposure = 3
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  /**
   * controls
   */
  const controls = new OrbitControls(camera, canvasEl)
  controls.enableDamping = true

  const clock = new THREE.Clock()
  const tick = () => {
    const elapsedTime = clock.getElapsedTime()
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

  //
  console.log(renderer.info)
}
