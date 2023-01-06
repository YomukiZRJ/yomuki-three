/*
 * @Desc: 银河生成
 */
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import useGui from '../hooks/useGui'
import { } from '../helper/guiHelper'
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
  const params = {
    count: 10000,
    radius: 5,
    size: 0.02,
    branches: 5,
    spin: 1,
    randomness: 0.2,
    randomnessPower: 5,
    insideColor: '#d11f28',
    outsideColor: '#313cdd'
  }

  let geometry: THREE.BufferGeometry | null = null
  let material: THREE.PointsMaterial | null = null
  let points: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial> | null = null
  /**
   * 创建银河
   */
  const generateGalaxy = () => {
    if (points){
      scene.remove(points)
      geometry?.dispose()
      material?.dispose()
      points = null
    }
    /**
     * 几何体
     */
    geometry = new THREE.BufferGeometry()
    const positions: number[] = []
    const colors: number[] = []

    const insideColor = new THREE.Color(params.insideColor)
    const outsideColor = new THREE.Color(params.outsideColor)

    for (let index = 0; index < params.count; index++){
      const radius = Math.random() * params.radius // 半径
      const spinAngle = radius * params.spin // 距离圆心越远的点 自旋转角度越大
      const branchAngle = (index % params.branches) * ((Math.PI * 2) / params.branches)

      const randomX = Math.random() ** params.randomnessPower * (Math.random() < 0.5 ? -1 : 1)
      const randomY = Math.random() ** params.randomnessPower * (Math.random() < 0.5 ? -1 : 1)
      const randomZ = Math.random() ** params.randomnessPower * (Math.random() < 0.5 ? -1 : 1)

      const x = Math.cos(branchAngle + spinAngle) * radius + randomX
      const y = randomY
      const z = Math.sin(branchAngle + spinAngle) * radius + randomZ
      positions.push(
        x,
        y,
        z
      )

      const mixedColor = insideColor.clone()
      mixedColor.lerp(outsideColor, radius / params.radius)
      colors.push(mixedColor.r, mixedColor.g, mixedColor.b)
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))
    /**
     * 材质
     */
    material = new THREE.PointsMaterial({
      size: params.size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    })
    /**
     * 点
     */
    points = new THREE.Points(geometry, material)
    scene.add(points)
  }
  /**
     * 创建gui面板
     */
  const createGui = () => {
    gui.add(params, 'count').min(100)
      .max(100000)
      .step(100)
      .onFinishChange(() => {
        generateGalaxy()
      })
    gui.add(params, 'radius').min(0.01)
      .max(20)
      .step(0.10)
      .onFinishChange(() => {
        generateGalaxy()
      })
    gui.add(params, 'branches').min(2)
      .max(20)
      .step(1)
      .onFinishChange(() => {
        generateGalaxy()
      })
    gui.add(params, 'spin').min(-5)
      .max(5)
      .step(0.001)
      .onFinishChange(() => {
        generateGalaxy()
      })
    gui.add(params, 'randomness').min(0)
      .max(2)
      .step(0.001)
      .onFinishChange(() => {
        generateGalaxy()
      })
    gui.add(params, 'randomnessPower').min(1)
      .max(10)
      .step(0.001)
      .onFinishChange(() => {
        generateGalaxy()
      })
    gui.add(params, 'size').min(0.001)
      .max(0.1)
      .step(0.001)
      .onChange((val) => {
        if (material) material.size = val
      })
    gui.addColor(params, 'insideColor').onFinishChange((val) => {
      generateGalaxy()
    })
    gui.addColor(params, 'outsideColor').onFinishChange((val) => {
      generateGalaxy()
    })
  }
  createGui()
  generateGalaxy()

  /**
   * camera
   */
  const camera = new THREE.PerspectiveCamera(75, aspect.value, 0.1, 100)
  camera.position.set(3, 3, 3)
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
}
