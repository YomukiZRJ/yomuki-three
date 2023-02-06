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
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
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
    format: THREE.RGBAFormat
  })

  if (renderer.getPixelRatio() === 1 && renderer.capabilities.isWebGL2)
    renderTarget.samples = 1

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
  rgbShiftPass.enabled = false
  effectComposer.addPass(rgbShiftPass)
  // UnrealBloomPass 会添加Bloom敷霜辉光效果到渲染中，它对重现光热、激光、光剑或放射性物质非常有用
  const unrealBloomPass = new UnrealBloomPass()
  effectComposer.addPass(unrealBloomPass)
  unrealBloomPass.enabled = false
  unrealBloomPass.strength = 0.3 // 光的强度
  unrealBloomPass.radius = 1 // 亮度的发散半径
  unrealBloomPass.threshold = 0.6 // 限制物体开始发光的亮度值
  gui.add(unrealBloomPass, 'enabled')
  gui.add(unrealBloomPass, 'strength').min(0)
    .max(2)
    .step(0.001)
  gui.add(unrealBloomPass, 'radius').min(0)
    .max(2)
    .step(0.001)
  gui.add(unrealBloomPass, 'threshold').min(0)
    .max(1)
    .step(0.001)

  // 自定义着色通道
  const TintShader = {
    uniforms: {
      tDiffuse: {
        value: null
      },
      uTint: {
        value: null
      }
    },
    vertexShader: `
      varying vec2 vUv;
      void main(){
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        vUv = uv;
      }
    `,
    fragmentShader: `
      uniform sampler2D tDiffuse;
      varying vec2 vUv;
      uniform vec3 uTint;
      void main(){
        vec4 color = texture2D(tDiffuse, vUv);
        color.rgb += uTint;
        gl_FragColor = color;
      }
    `
  }
  const tintPass = new ShaderPass(TintShader)
  // 注意，我们将该值设为null。
  // 不要直接在着色器对象中设置值，必须在创建完通道后，再去材质中修改值，因为着色器会被多次使用，即便没使用到也一样。
  tintPass.material.uniforms.uTint.value = new THREE.Vector3()
  effectComposer.addPass(tintPass)
  gui.add(tintPass.material.uniforms.uTint.value, 'x').min(-1)
    .max(1)
    .step(0.001)
    .name('red')
  gui.add(tintPass.material.uniforms.uTint.value, 'y').min(-1)
    .max(1)
    .step(0.001)
    .name('green')
  gui.add(tintPass.material.uniforms.uTint.value, 'z').min(-1)
    .max(1)
    .step(0.001)
    .name('blue')

  // 自定义位移通道 ， 利用uv来产生位移效果
  const DisplacementShader = {
    uniforms: {
      tDiffuse: {
        value: null
      },
      uNormalMap: {
        value: null
      }
    },
    vertexShader: `
    varying vec2 vUv;
    void main(){
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      vUv = uv;
    }
  `,
    fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform sampler2D uNormalMap;
    varying vec2 vUv;
    void main(){
      vec3 normalColor = texture2D(uNormalMap,vUv).xyz * 2.0 - 1.0; 
      vec2 newUv = vUv + normalColor.xy * 0.1;
      vec4 color = texture2D(tDiffuse, newUv);

      vec3 lightDirection = normalize(vec3(- 1.0, 1.0, 0.0));
      float lightness = clamp(dot(normalColor, lightDirection), 0.0, 1.0);
      color.rgb += lightness * 2.0;
      
      gl_FragColor = color;
    }
  `
  }
  const displacementPass = new ShaderPass(DisplacementShader)
  displacementPass.material.uniforms.uNormalMap.value = textureLoader.load('../assets/textures/interfaceNormalMap.png')
  effectComposer.addPass(displacementPass)

  // 使用通道来完成抗齿距
  if (renderer.getPixelRatio() === 1 && !renderer.capabilities.isWebGL2){
    const smaaPass = new SMAAPass()
    effectComposer.addPass(smaaPass)
  }

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
