/*
 * @Desc: 性能小提示
 */
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
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

  const aspect = computed(() => width.value / height.value)
  const scene = new THREE.Scene()

  /**
 * Loaders
 */
  const textureLoader = new THREE.TextureLoader()
  const displacementTexture = textureLoader.load('../assets/textures/displacementMap.png')

  /**
   * camera
   */
  const camera = new THREE.PerspectiveCamera(75, aspect.value, 0.1, 100)
  camera.position.set(2, 2, 6)
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
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  /**
 * Test meshes
 */
  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.MeshStandardMaterial()
  )
  cube.castShadow = true
  cube.receiveShadow = true
  cube.position.set(-5, 0, 0)
  scene.add(cube)

  const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1, 0.4, 128, 32),
    new THREE.MeshStandardMaterial()
  )
  torusKnot.castShadow = true
  torusKnot.receiveShadow = true
  scene.add(torusKnot)

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshStandardMaterial()
  )
  sphere.position.set(5, 0, 0)
  sphere.castShadow = true
  sphere.receiveShadow = true
  scene.add(sphere)

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial()
  )
  floor.position.set(0, -2, 0)
  floor.rotation.x = -Math.PI * 0.5
  floor.castShadow = true
  floor.receiveShadow = true
  scene.add(floor)

  /**
 * Lights
 */
  const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.set(1024, 1024)
  directionalLight.shadow.camera.far = 15
  directionalLight.shadow.normalBias = 0.05
  directionalLight.position.set(0.25, 3, 2.25)
  scene.add(directionalLight)

  /**
   * controls
   */
  const controls = new OrbitControls(camera, canvasEl)
  controls.enableDamping = true

  const clock = new THREE.Clock()
  const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    controls.update()

    // Update test mesh
    torusKnot.rotation.y = elapsedTime * 0.1

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
