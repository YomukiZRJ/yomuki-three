/*
 * @Desc: 着色器
 */
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import useGui from '../hooks/useGui'
import vertexShader from '../assets/shaders/test/vertex.glsl'
import fragmentShader from '../assets/shaders/test/fragment.glsl'

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

  }

  const aspect = computed(() => width.value / height.value)
  const scene = new THREE.Scene()
  scene.add(new THREE.AxesHelper(20))

  const textureLoader = new THREE.TextureLoader()
  const textureFlag = textureLoader.load('../assets/textures/flag-french.jpg')

  /**
   * objects
   */
  const gemotery = new THREE.PlaneGeometry(1, 1, 32, 32)
  const count = gemotery.attributes.position.count // 顶点数量
  const randoms = new Float32Array(count)
  for (let index = 0; index < count; index++)
    randoms[index] = Math.random()
  gemotery.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))
  const material = new THREE.RawShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      // uFrequency: {
      //   value: 10.0
      // }
      uFrequency: {
        value: new THREE.Vector2(10, 5)
      },
      uTime: {
        value: 0
      },
      uColor: {
        value: new THREE.Color('pink')
      },
      uTexture: {
        value: textureFlag
      }
    },
    wireframe: true
  })
  gui.add(material.uniforms.uFrequency.value, 'x').min(0)
    .max(20)
    .step(0.01)
    .name('波浪频率x')
  gui.add(material.uniforms.uFrequency.value, 'y').min(0)
    .max(20)
    .step(0.01)
    .name('波浪频率y')
  const mesh = new THREE.Mesh(gemotery, material)
  mesh.scale.y = 2 / 3
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

    // 更新材质
    material.uniforms.uTime.value = elapsedTime

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
