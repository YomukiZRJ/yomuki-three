/*
 * @Desc: 用着色器来制作银河
 */
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import useGui from '../hooks/useGui'
import vertex from '../assets/shaders/galaxy/vertex.glsl'
import fragment from '../assets/shaders/galaxy/fragment.glsl'
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
    count: 200000,
    radius: 5,
    size: 0.005,
    branches: 3,
    spin: 1,
    randomness: 0.5,
    randomnessPower: 3,
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
    const positions: number[] = [] // 点坐标 3个一组
    const colors: number[] = [] // 颜色坐标 3个一组
    const scales: number[] = [] // 点的大小缩放 1个一组
    const randomness: number[] = [] // 点位偏移随机 3个一组

    const insideColor = new THREE.Color(params.insideColor)
    const outsideColor = new THREE.Color(params.outsideColor)

    for (let index = 0; index < params.count; index++){
      const radius = Math.random() * params.radius // 半径
      //   const spinAngle = radius * params.spin // 距离圆心越远的点 自旋转角度越大
      const branchAngle = (index % params.branches) * ((Math.PI * 2) / params.branches)
      const x = Math.cos(branchAngle) * radius
      const y = 0.0
      const z = Math.sin(branchAngle) * radius
      positions.push(
        x,
        y,
        z
      )

      // 点位随机性
      const randomX = Math.random() ** params.randomnessPower * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius
      const randomY = Math.random() ** params.randomnessPower * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius
      const randomZ = Math.random() ** params.randomnessPower * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius
      randomness.push(randomX, randomY, randomZ)

      // 颜色
      const mixedColor = insideColor.clone()
      mixedColor.lerp(outsideColor, radius / params.radius)
      colors.push(mixedColor.r, mixedColor.g, mixedColor.b)

      // 随机缩放
      scales.push(Math.random())
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))
    geometry.setAttribute('aScale', new THREE.BufferAttribute(new Float32Array(scales), 1))
    geometry.setAttribute('aRandomness', new THREE.BufferAttribute(new Float32Array(randomness), 3))
    /**
     * 材质
     */
    material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      depthWrite: false, // 关闭材质对深度缓冲区的影响
      blending: THREE.AdditiveBlending, // 混合方式为加法混合
      vertexColors: true,
      transparent: true,
      uniforms: {
        uTime: {
          value: 0
        },
        uSize: {
          value: 30.0 * renderer.getPixelRatio() // 处理不同设备下的像素比问题
        }
      }
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
      .max(500000)
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
    // gui.add(params, 'size').min(0.001)
    //   .max(0.1)
    //   .step(0.001)
    //   .onChange((val) => {
    //     if (material) material.size = val
    //   })
    gui.addColor(params, 'insideColor').onFinishChange((val) => {
      generateGalaxy()
    })
    gui.addColor(params, 'outsideColor').onFinishChange((val) => {
      generateGalaxy()
    })
  }

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

  createGui()
  generateGalaxy()

  const clock = new THREE.Clock()
  const tick = () => {
    const elapsedTime = clock.getElapsedTime()
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
