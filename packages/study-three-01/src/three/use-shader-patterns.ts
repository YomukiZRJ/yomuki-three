/*
 * @Desc: 着色器
 */
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import useGui from '../hooks/useGui'
import vertexShader from '../assets/shaders/test2/vertex.glsl'
import fragmentShader from '../assets/shaders/test2/fragment.glsl'

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
  scene.add(new THREE.AxesHelper(20))

  const textureLoader = new THREE.TextureLoader()

  /**
   * objects
   */
  const gemotery = new THREE.PlaneGeometry(1, 1, 32, 32)
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    wireframe: false,
    side: THREE.DoubleSide
  })
  const mesh = new THREE.Mesh(gemotery, material)
  scene.add(mesh)

  /**
   * camera
   */
  const camera = new THREE.PerspectiveCamera(75, aspect.value, 0.1, 100)
  camera.position.set(0.25, -0.25, 1)
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

  /**
   * controls
   */
  const controls = new OrbitControls(camera, canvasEl)
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
