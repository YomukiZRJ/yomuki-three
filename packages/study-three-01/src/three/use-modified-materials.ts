/*
 * @Desc: 修改three的内置材质
 */
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
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
        child.material.envMapIntensity = 1
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
 * Material
 */

  // Textures
  const mapTexture = textureLoader.load('../assets/models/LeePerrySmith/color.jpg')
  mapTexture.encoding = THREE.sRGBEncoding

  const normalTexture = textureLoader.load('../assets/models/LeePerrySmith/normal.jpg')

  // Material
  const material = new THREE.MeshStandardMaterial({
    map: mapTexture,
    normalMap: normalTexture
  })
  const depthMaterial = new THREE.MeshDepthMaterial({
    depthPacking: THREE.RGBADepthPacking
  })
  // 塞点需要变的uniforms进去
  // material.defines = {
  //   uTime: 0
  // }
  // 自定义uniforms
  const customUniforms = {
    uTime: {
      value: 0
    }
  }

  const setCustomShader = (shader: THREE.Shader) => {
    // 塞点uniforms进去
    shader.uniforms.uTime = customUniforms.uTime
    // console.log(shader.uniforms)
    // 塞点全局的工具函数和变量进去
    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      `
      #include <common>
      mat2 getRotate2dMatrix(float _angle){
        return mat2(
            cos(_angle),-sin(_angle),
            sin(_angle),cos(_angle)
        );
      }
      float uTime;
      `
    )
  }
  material.onBeforeCompile = (shader) => {
    // console.log(shader.vertexShader)
    setCustomShader(shader)
    // 修复法线
    shader.vertexShader = shader.vertexShader.replace(
      '#include <beginnormal_vertex>',
      `
      #include <beginnormal_vertex>
      float angle =  (position.y + uTime) * 0.9; // 根据y坐标和时间，有着不同的旋转角度
      mat2 rotateMatrix = getRotate2dMatrix(angle);
      objectNormal.zx = objectNormal.zx * rotateMatrix; // 如果是xz的话就是顺时针转
      `
    )
    // 改变顶点
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
          `
          #include <begin_vertex>
          transformed.zx = transformed.zx * rotateMatrix; // 如果是xz的话就是顺时针转
          `
    )
  }
  // 修复阴影
  depthMaterial.onBeforeCompile = (shader) => {
    setCustomShader(shader)
    // 改变顶点
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
          `
          #include <begin_vertex>
          float angle = (position.y + uTime) * 0.9; // 根据y坐标和时间，有着不同的旋转角度
          mat2 rotateMatrix = getRotate2dMatrix(angle);
          transformed.zx = transformed.zx * rotateMatrix; // 如果是xz的话就是顺时针转
          `
    )
  }

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(15, 15, 15),
    new THREE.MeshStandardMaterial()
  )
  plane.rotation.y = Math.PI
  plane.position.y = -5
  plane.position.z = 5
  scene.add(plane)

  /**
 * Models
 */
  gltfLoader.load(
    '../assets/models/LeePerrySmith/LeePerrySmith.glb',
    (gltf) => {
      // Model
      const mesh = gltf.scene.children[0]
      mesh.rotation.y = Math.PI * 0.5
      mesh.material = material
      mesh.customDepthMaterial = depthMaterial // 使用自定义深度材质 用来修复阴影
      scene.add(mesh)

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
  directionalLight.position.set(0.25, 2, -2.25)
  scene.add(directionalLight)

  /**
   * camera
   */
  const camera = new THREE.PerspectiveCamera(75, aspect.value, 0.1, 100)
  camera.position.set(4, 1, -4)
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
  renderer.shadowMap.type = THREE.PCFShadowMap
  renderer.physicallyCorrectLights = true
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1

  /**
   * controls
   */
  const controls = new OrbitControls(camera, canvasEl)
  controls.enableDamping = true

  const clock = new THREE.Clock()
  const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    // 改变材质
    // material.defines.uTime = elapsedTime
    // material.needsUpdate = true
    customUniforms.uTime.value = elapsedTime
    // material.needsUpdate = true

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
