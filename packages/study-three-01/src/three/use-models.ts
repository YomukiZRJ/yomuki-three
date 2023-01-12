/*
 * @Desc: 银河生成
 */
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import useGui from '../hooks/useGui'

export default (
  canvasEl: Ref<HTMLCanvasElement>,
  width: Ref<number>,
  height: Ref<number>
) => {
  let mixer: null | THREE.AnimationMixer = null
  let surveyAction: null | THREE.AnimationAction = null
  let walkAction: null | THREE.AnimationAction = null
  let runAction: null | THREE.AnimationAction = null
  /**
   * 创建gui对象
   */
  const { gui } = useGui()

  const aspect = computed(() => width.value / height.value)
  const scene = new THREE.Scene()
  scene.add(new THREE.AxesHelper(20))

  /**
   * 使用gltf加载器
   */
  const glTFLoader = new GLTFLoader()
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('../draco/')
  glTFLoader.setDRACOLoader(dracoLoader)
  glTFLoader.load(
    '../assets/models/Fox/glTF/Fox.gltf',
    /**
     * 载入完成
     */
    (gltf) => {
      console.log(gltf)
      /**
       * 动画
       */
      mixer = new THREE.AnimationMixer(gltf.scene) // 创建动画剪辑器
      surveyAction = mixer.clipAction(gltf.animations[0])
      walkAction = mixer.clipAction(gltf.animations[1])
      runAction = mixer.clipAction(gltf.animations[2])
      runAction.play()
      surveyAction.play()
      /**
       * 处理
       */
      gltf.scene.scale.set(0.025, 0.025, 0.025)// 模型有点大 缩小下
      /**
       * 添加
       */
      scene.add(gltf.scene)
      // scene.add(gltf.scene.children[0])
      // 先复制一下，因为蒋一个mesh添加到场景中时，会从上一个场景中移除，会导致循环出问题。
      // const children = [...gltf.scene.children]
      // children.forEach((item) => {
      //   scene.add(item)
      // })
    },
    /**
     * 载入中
     */
    (xhr) => {
      console.log(`${xhr.loaded / xhr.total * 100}% loaded`)
    },
    /**
     * 载入失败
     */
    (error) => {
      console.error(error)
    }
  )
  /**
 * Floor
 */
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
      color: '#444444',
      metalness: 0,
      roughness: 0.5
    })
  )
  floor.receiveShadow = true
  floor.rotation.x = -Math.PI * 0.5
  scene.add(floor)

  /**
 * Lights
 */
  const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.8)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.6)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.set(1024, 1024)
  directionalLight.shadow.camera.far = 15
  directionalLight.shadow.camera.left = -7
  directionalLight.shadow.camera.top = 7
  directionalLight.shadow.camera.right = 7
  directionalLight.shadow.camera.bottom = -7
  directionalLight.position.set(5, 5, 5)
  scene.add(directionalLight)

  /**
   * camera
   */
  const camera = new THREE.PerspectiveCamera(75, aspect.value, 0.1, 100)
  camera.position.set(2, 2, 2)
  scene.add(camera)
  /**
   * renderer
   */
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasEl
  })
  renderer.setSize(width.value, height.value)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // 设置像素比
  renderer.setClearColor('#00000f')
  renderer.shadowMap.enabled = true

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

    if (mixer)
      mixer.update(deltaTime)

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
