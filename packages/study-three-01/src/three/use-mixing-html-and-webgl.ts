/*
 * @Desc: 混合html和webgl
 */
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
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
  // Debug
  const debugObject = {}

  const aspect = computed(() => width.value / height.value)
  const scene = new THREE.Scene()

  scene.add(new THREE.AxesHelper(10))

  /**
 * Loaders
 */
  const gltfLoader = new GLTFLoader()
  const cubeTextureLoader = new THREE.CubeTextureLoader()

  /**
 * Update all materials
 */
  const updateAllMaterials = () => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial){
        // child.material.envMap = environmentMap
        child.material.envMapIntensity = debugObject.envMapIntensity
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

  debugObject.envMapIntensity = 2.5

  /**
 * Models
 */
  gltfLoader.load(
    '../assets/models/FlightHelmet/glTF/FlightHelmet.gltf',
    (gltf) => {
      gltf.scene.scale.set(10, 10, 10)
      gltf.scene.position.set(0, -4, 0)
      gltf.scene.rotation.y = Math.PI * 0.5
      scene.add(gltf.scene)

      updateAllMaterials()
    }
  )

  /**
 * Lights
 */
  const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
  directionalLight.castShadow = true
  directionalLight.shadow.camera.far = 15
  directionalLight.shadow.mapSize.set(1024, 1024)
  directionalLight.shadow.normalBias = 0.05
  directionalLight.position.set(0.25, 3, -2.25)
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
    canvas: canvasEl,
    antialias: true
  })
  renderer.setSize(width.value, height.value)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // 设置像素比
  renderer.setClearColor('#00000f')
  renderer.physicallyCorrectLights = true
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.toneMapping = THREE.ReinhardToneMapping
  renderer.toneMappingExposure = 3
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  /**
   * controls
   */
  const controls = new OrbitControls(camera, canvasEl)
  controls.enableDamping = true

  // 光线投射器 用来判断点之前是否有物体存在
  const raycaster = new THREE.Raycaster()

  // 元素数组
  const points: [{position: THREE.Vector3; el: HTMLElement}] = [
    {
      position: new THREE.Vector3(1.55, 0.3, -0.6), // 3d坐标
      el: document.querySelector('.point-0') // 元素
    },
    {
      position: new THREE.Vector3(1, 1, 2.6), // 3d坐标
      el: document.querySelector('.point-1') // 元素
    },
    {
      position: new THREE.Vector3(-10, 1, 2.6), // 3d坐标
      el: document.querySelector('.point-2') // 元素
    }
  ]

  /**
       * 更新点位置 在帧动画中使用
       * 根据场景中的3D坐标来获取屏幕上的二维坐标
       */
  const updatePointsPosition = () => {
    points.forEach(({ position, el }) => {
      const screenPosition = position.clone()
      // 转为基于相机的坐标
      screenPosition.project(camera)
      // 把这个值 * 画布的一半
      const translateX = screenPosition.x * width.value * 0.5
      const translateY = -screenPosition.y * height.value * 0.5
      // 移动元素
      el.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`
      // 设置射线的目标点和相机
      raycaster.setFromCamera(screenPosition, camera)
      // 计算物体和射线的焦点，返回相交对象数组，这些对象会按照距离排序
      const intersects = raycaster.intersectObjects(scene.children, true)
      if (intersects.length === 0){
        // 没有物体遮挡
        el.classList.add('visible')
      } else {
        // 比较相交对象的距离和元素到相机的距离，来确定元素是否显示
        const intersectsDistance = intersects[0].distance
        const pointDistance = position.distanceTo(camera.position) // 点到相机的距离
        if (intersectsDistance <= pointDistance)
          el.classList.remove('visible')
        else
          el.classList.add('visible')
      }
    })
  }

  const clock = new THREE.Clock()
  const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    controls.update()
    updatePointsPosition()
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
