/*
 * @Desc: 粒子
 */
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import useGui from '../hooks/useGui'
import { createPerspectiveCameraGui, createPointsMaterialGui } from '../helper/guiHelper'
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
 * Textures
 */
  const textureLoader = new THREE.TextureLoader()
  const particleTexture = textureLoader.load('../assets/textures/particles/8.png')

  /**
   * 粒子
   */
  /**
   * 通过内置几何体创建粒子
   */
  // const particlesGeometry = new THREE.SphereGeometry(1, 32, 32)
  // const particlesMaterial = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.0078 })
  // createPointsMaterialGui(gui, particlesMaterial)
  // const particles = new THREE.Points(particlesGeometry, particlesMaterial)
  // scene.add(particles)
  /**
   * 创建随机粒子
   */
  const count = 1000
  const vertices = []
  const colors = []
  for (let index = 0; index < count; index++){
    const x = (Math.random() - 0.5) * 4
    const y = (Math.random() - 0.5) * 4
    const z = (Math.random() - 0.5) * 4
    vertices.push(x, y, z)
    const r = Math.random()
    const g = Math.random()
    const b = Math.random()
    colors.push(r, g, b)
  }
  const particlesGeometry = new THREE.BufferGeometry()
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3))
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))
  const particlesMaterial = new THREE.PointsMaterial({ color: '#8a6666', size: 0.5, transparent: true, alphaMap: particleTexture, vertexColors: true })
  const particles = new THREE.Points(particlesGeometry, particlesMaterial)
  scene.add(particles)
  /**
   * 解决粒子边缘渲染问题
   */
  // 法1：如果不透明度低于此值，则不会渲染材质
  // particlesMaterial.alphaTest = 0.25
  // 法2：关闭深度测试，但是这个方法会导致该粒子不进行深度渲染。如果同场景中存在其他对象，该粒子会不管远近都渲染出来
  // particlesMaterial.depthTest = false
  // 法3：关闭材质对深度缓冲区的影响
  // particlesMaterial.depthWrite = false
  // 法4：关闭材质对深度缓冲区的影响，并修改此材质显示对象时要使用的混合方式为加法混合
  // 什么是加法混合：叠加在上面的更亮
  particlesMaterial.depthWrite = false
  particlesMaterial.blending = THREE.AdditiveBlending

  // const cube = new THREE.Mesh(
  //   new THREE.BoxGeometry(),
  //   new THREE.MeshBasicMaterial()
  // )
  // scene.add(cube)
  /**
   * camera
   */
  const camera = new THREE.PerspectiveCamera(75, aspect.value, 0.1, 100)
  camera.position.z = 3
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

  /**
   * controls
   */
  const controls = new OrbitControls(camera, canvasEl)
  controls.enableDamping = true

  const clock = new THREE.Clock()
  const tick = () => {
    // animation1()
    animation2()
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
  }
  const animation1 = () => {
    const elapsedTime = clock.getElapsedTime()
    particles.rotation.y = elapsedTime * 0.5
    particles.rotation.x = elapsedTime * 0.25
    particles.rotation.z = elapsedTime * 0.3
  }
  /**
   * 波浪动画
   * 修改顶点坐标来做动画是一个错误的方式，他会带来很大的性能消耗
   * 正确的方式是创建自定义材质，编写自己的着色器
   */
  const animation2 = () => {
    const elapsedTime = clock.getElapsedTime()
    for (let index = 0; index < count; index++){
      const i3 = index * 3
      const x = particlesGeometry.attributes.position.array[i3]
      particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
    }
    particlesGeometry.attributes.position.needsUpdate = true
  }
  tick()
  const handleResize = () => {
    renderer.setSize(width.value, height.value)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    camera.aspect = aspect.value
    camera.updateProjectionMatrix()
  }
  window.addEventListener('resize', handleResize)
  createPointsMaterialGui(gui, particlesMaterial)
}
