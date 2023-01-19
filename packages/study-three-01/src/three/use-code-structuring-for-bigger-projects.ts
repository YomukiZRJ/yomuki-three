/*
 * @Desc: 大型项目的代码分割
 */
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import useGui from '../hooks/useGui'

export default (
  canvasEl: Ref<HTMLCanvasElement>,
  width: Ref<number>,
  height: Ref<number>
) => {
  /**
 * Loaders
 */
  const gltfLoader = new GLTFLoader()
  const textureLoader = new THREE.TextureLoader()
  const cubeTextureLoader = new THREE.CubeTextureLoader()
  /**
   * 创建gui对象
   */
  const { gui } = useGui()
  const debugObject = {

  }

  const aspect = computed(() => width.value / height.value)
  const scene = new THREE.Scene()
  scene.add(new THREE.AxesHelper(20))

  /**
 * Environment map
 */
  const environmentMap = cubeTextureLoader.setPath('../assets/environmentMaps/0/').load([
    'px.jpg', // 正x
    'nx.jpg', // 负x
    'py.jpg', // 正y
    'ny.jpg', // 负y
    'pz.jpg', // 正z
    'nz.jpg'// 负z
  ])

  environmentMap.encoding = THREE.sRGBEncoding
  // scene.background = environmentMap
  scene.environment = environmentMap
  debugObject.envMapIntensity = 0.4

  /**
 * Update all materials
 */
  const updateAllMaterials = () => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
        updateStandardMaterials(child)
    })
  }
  const updateStandardMaterials = (mesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>) => {
    mesh.material.envMapIntensity = debugObject.envMapIntensity
    mesh.material.needsUpdate = true
    mesh.castShadow = true
    mesh.receiveShadow = true
  }
  gui.add(debugObject, 'envMapIntensity').min(0)
    .max(4)
    .step(0.001)
    .onChange(updateAllMaterials)

  /**
 * Models
 */
  let foxMixer: null | THREE.AnimationMixer = null

  gltfLoader.load(
    '../assets/models/Fox/glTF/Fox.gltf',
    (gltf) => {
      console.log('模型载入成功', gltf)

      // Model
      gltf.scene.scale.set(0.02, 0.02, 0.02)
      scene.add(gltf.scene)

      // Animation
      foxMixer = new THREE.AnimationMixer(gltf.scene)
      const foxAction = foxMixer.clipAction(gltf.animations[0])
      foxAction.play()

      // Update materials
      updateAllMaterials()
    }
  )

  /**
 * Floor
 */
  const floorColorTexture = textureLoader.load('../assets/textures/dirt/color.jpg')
  floorColorTexture.encoding = THREE.sRGBEncoding
  floorColorTexture.repeat.set(1.5, 1.5)
  floorColorTexture.wrapS = THREE.RepeatWrapping
  floorColorTexture.wrapT = THREE.RepeatWrapping

  const floorNormalTexture = textureLoader.load('../assets/textures/dirt/normal.jpg')
  floorNormalTexture.repeat.set(1.5, 1.5)
  floorNormalTexture.wrapS = THREE.RepeatWrapping
  floorNormalTexture.wrapT = THREE.RepeatWrapping

  const floorGeometry = new THREE.CircleGeometry(5, 64)
  const floorMaterial = new THREE.MeshStandardMaterial({
    map: floorColorTexture,
    normalMap: floorNormalTexture
  })
  const floor = new THREE.Mesh(floorGeometry, floorMaterial)
  floor.rotation.x = -Math.PI * 0.5
  scene.add(floor)

  /**
 * Lights
 */
  const directionalLight = new THREE.DirectionalLight('#ffffff', 4)
  directionalLight.castShadow = true
  directionalLight.shadow.camera.far = 15
  directionalLight.shadow.mapSize.set(1024, 1024)
  directionalLight.shadow.normalBias = 0.05
  directionalLight.position.set(3.5, 2, -1.25)
  scene.add(directionalLight)

  gui.add(directionalLight, 'intensity').min(0)
    .max(10)
    .step(0.001)
    .name('lightIntensity')
  gui.add(directionalLight.position, 'x').min(-5)
    .max(5)
    .step(0.001)
    .name('lightX')
  gui.add(directionalLight.position, 'y').min(-5)
    .max(5)
    .step(0.001)
    .name('lightY')
  gui.add(directionalLight.position, 'z').min(-5)
    .max(5)
    .step(0.001)
    .name('lightZ')
  /**
   * camera
   */
  const camera = new THREE.PerspectiveCamera(35, aspect.value, 0.1, 100)
  camera.position.set(6, 4, 8)
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
  renderer.setClearColor('#211d20')
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.physicallyCorrectLights = true
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.toneMapping = THREE.CineonToneMapping
  renderer.toneMappingExposure = 1.75

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

    if (foxMixer) foxMixer.update(deltaTime)
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
