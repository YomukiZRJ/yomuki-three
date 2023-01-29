/*
 * @Desc: 着色器
 */
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import useGui from '../hooks/useGui'
import waterVertexShader from '../assets/shaders/water/vertex.glsl'
import waterFragmentShader from '../assets/shaders/water/fragment.glsl'

export default (
  canvasEl: Ref<HTMLCanvasElement>,
  width: Ref<number>,
  height: Ref<number>
) => {
  /**
   * 创建gui对象
   */
  const { gui } = useGui()
  const debugObject = {
    depthColor: '#186691',
    surfaceColor: '#9bd8ff'
  }

  const aspect = computed(() => width.value / height.value)
  const scene = new THREE.Scene()
  scene.add(new THREE.AxesHelper(20))

  const textureLoader = new THREE.TextureLoader()

  /**
 * Water
 */
  // Geometry
  const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512)

  // Material
  const waterMaterial = new THREE.ShaderMaterial(
    {
      vertexShader: waterVertexShader,
      fragmentShader: waterFragmentShader,
      wireframe: false,
      uniforms: {
        // 时间
        uTime: {
          value: 0
        },
        // 波浪
        uBigWavesElevation: {
          value: 0.2// 坡度
        },
        uBigWavesFrequency: {
          value: new THREE.Vector2(4, 1.5)// x,y轴上的分支
        },
        uBigWavesSpeed: {
          value: 0.75// 速度
        },
        // 颜色
        uDepthColor: {
          value: new THREE.Color(debugObject.depthColor) // 深处颜色
        },
        uSurfaceColor: {
          value: new THREE.Color(debugObject.surfaceColor) // 表面颜色
        },
        uColorOffset: {
          value: 0.08
        },
        uColorMultiplier: {
          value: 5
        },
        // 小波浪
        uSmallWavesElevation: {
          value: 0.15
        },
        uSmallWavesFrequency: {
          value: 3
        },
        uSmallWavesSpeed: {
          value: 0.2
        },
        uSmallWavesInterations: {
          value: 4.0
        }
      }
    }
  )
  gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value').min(0.01)
    .max(1)
    .step(0.001)
    .name('波浪坡度')
  gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x').min(0)
    .max(10)
    .step(0.001)
    .name('x轴上波浪数量')
  gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y').min(0)
    .max(10)
    .step(0.001)
    .name('y轴上波浪数量')
  gui.add(waterMaterial.uniforms.uBigWavesSpeed, 'value').min(0.01)
    .max(3)
    .step(0.001)
    .name('大波浪速度')
  gui.addColor(debugObject, 'depthColor').name('深处颜色')
    .onChange(() => {
      waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor)
    })
  gui.addColor(debugObject, 'surfaceColor').name('表面颜色')
    .onChange(() => {
      waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor)
    })
  gui.add(waterMaterial.uniforms.uColorOffset, 'value').min(0)
    .max(1)
    .step(0.001)
    .name('颜色坡度偏移')
  gui.add(waterMaterial.uniforms.uColorMultiplier, 'value').min(0)
    .max(10)
    .step(0.001)
    .name('颜色乘数')
  gui.add(waterMaterial.uniforms.uSmallWavesElevation, 'value').min(0.01)
    .max(1)
    .step(0.001)
    .name('小波浪坡度')
  gui.add(waterMaterial.uniforms.uSmallWavesFrequency, 'value').min(0.01)
    .max(10)
    .step(0.001)
    .name('小波浪分支')
  gui.add(waterMaterial.uniforms.uSmallWavesSpeed, 'value').min(0.001)
    .max(3)
    .step(0.001)
    .name('小波浪速度')
  gui.add(waterMaterial.uniforms.uSmallWavesInterations, 'value').min(1)
    .max(10)
    .step(1)
    .name('小波浪数量')

  // Mesh
  const water = new THREE.Mesh(waterGeometry, waterMaterial)
  water.rotation.x = -Math.PI * 0.5
  scene.add(water)

  /**
   * camera
   */
  const camera = new THREE.PerspectiveCamera(75, aspect.value, 0.1, 100)
  camera.position.set(1, 1, 1)
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
    waterMaterial.uniforms.uTime.value = elapsedTime

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
