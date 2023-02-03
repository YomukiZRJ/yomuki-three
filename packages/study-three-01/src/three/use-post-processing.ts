/*
 * @Desc: 后期处理
 */
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
// pass
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader'
// 伽马矫正
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader'
// 通道
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass'
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
  const gltfLoader = new GLTFLoader()
  const cubeTextureLoader = new THREE.CubeTextureLoader()

  /**
 * Update all materials
 */
  const updateAllMaterials = () => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial){
        child.material.envMapIntensity = 2.5
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

  /**
 * Models
 */
  gltfLoader.load(
    '../assets/models/DamagedHelmet/glTF/DamagedHelmet.gltf',
    (gltf) => {
      // Model
      gltf.scene.scale.set(2, 2, 2)
      gltf.scene.rotation.y = Math.PI * 0.5
      scene.add(gltf.scene)

      // Update materials
      updateAllMaterials()
    }
  )

  /**
 * Lights
 */
  const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.set(1024, 1024)
  directionalLight.shadow.camera.far = 15
  directionalLight.shadow.normalBias = 0.05
  directionalLight.position.set(0.25, 3, -2.25)
  scene.add(directionalLight)

  /**
   * camera
   */
  const camera = new THREE.PerspectiveCamera(75, aspect.value, 0.1, 100)
  camera.position.set(4, 1, -2)
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
  renderer.shadowMap.type = THREE.PCFShadowMap
  renderer.physicallyCorrectLights = true
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.toneMapping = THREE.ReinhardToneMapping
  renderer.toneMappingExposure = 1.5

  /**
   * effext composer
   */
  // render target
  // width 和height不重要，因为后面的setSize会更新它们
  const renderTarget = new THREE.WebGLRenderTarget(800, 600, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    // encoding: THREE.sRGBEncoding,
    samples: 1
  })

  // composer
  const effectComposer = new EffectComposer(renderer, renderTarget)
  effectComposer.setSize(width.value, height.value)
  effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  // 渲染过程
  const renderPass = new RenderPass(scene, camera)
  effectComposer.addPass(renderPass)
  // dot screen pass (点状网目板)
  const dotScreenPass = new DotScreenPass()
  dotScreenPass.enabled = false
  effectComposer.addPass(dotScreenPass)
  // Glitch Pass (故障)(像是黑客入侵的效果)
  const glitchPass = new GlitchPass()
  glitchPass.enabled = false
  glitchPass.goWild = false // 为true的时，会有一种闪瞎的效果
  effectComposer.addPass(glitchPass)
  // rgb shift pass (颜色位移)（一种赛博朋克的效果）
  const rgbShiftPass = new ShaderPass(RGBShiftShader)
  rgbShiftPass.enabled = true
  effectComposer.addPass(rgbShiftPass)
  // 使用通道来完成抗齿距
  // const smaaPass = new SMAAPass()
  // effectComposer.addPass(smaaPass)
  // 使用gamma矫正
  const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
  effectComposer.addPass(gammaCorrectionPass)

  /**
   * controls
   */
  const controls = new OrbitControls(camera, canvasEl)
  controls.enableDamping = true

  const clock = new THREE.Clock()
  const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    controls.update()
    // renderer.render(scene, camera)
    effectComposer.render()
    window.requestAnimationFrame(tick)
  }

  tick()
  const handleResize = () => {
    renderer.setSize(width.value, height.value)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    effectComposer.setSize(width.value, height.value)
    effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    camera.aspect = aspect.value
    camera.updateProjectionMatrix()
  }
  window.addEventListener('resize', handleResize)
}
