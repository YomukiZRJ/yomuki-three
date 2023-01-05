/*
 * @Desc: 鬼屋
 */
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import useGui from '../hooks/useGui'
import { createAmbientLightGui, createDirectionalLightGui, createFogGui, createMeshStandardMaterialGui } from '../helper/guiHelper'
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
  // 门的纹理
  const loadingManager = new THREE.LoadingManager()
  const textureLoader = new THREE.TextureLoader(loadingManager)
  const doorColorTexture = textureLoader.load('../assets/textures/door/color.jpg')
  const doorAlphaTexture = textureLoader.load('../assets/textures/door/alpha.jpg')
  const doorAmbientOcclusionTexture = textureLoader.load('../assets/textures/door/ambientOcclusion.jpg')
  const doorHeightTexture = textureLoader.load('../assets/textures/door/height.jpg')
  const doorMatalnessTexture = textureLoader.load('../assets/textures/door/metalness.jpg')
  const doorNormalTexture = textureLoader.load('../assets/textures/door/normal.jpg')
  const doorRoughnessTexture = textureLoader.load('../assets/textures/door/roughness.jpg')
  // 墙的纹理
  const wallColorTexture = textureLoader.load('../assets/textures/bricks/color.jpg')
  const wallAmbientOcclusionTexture = textureLoader.load('../assets/textures/bricks/ambientOcclusion.jpg')
  const wallNormalTexture = textureLoader.load('../assets/textures/bricks/normal.jpg')
  const wallRoughnessTexture = textureLoader.load('../assets/textures/bricks/roughness.jpg')
  // 草地的纹理
  const grassColorTexture = textureLoader.load('../assets/textures/grass/color.jpg')
  const grassAmbientOcclusionTexture = textureLoader.load('../assets/textures/grass/ambientOcclusion.jpg')
  const grassNormalTexture = textureLoader.load('../assets/textures/grass/normal.jpg')
  const grassRoughnessTexture = textureLoader.load('../assets/textures/grass/roughness.jpg')
  grassColorTexture.repeat.set(8, 8)
  grassColorTexture.wrapS = THREE.RepeatWrapping
  grassColorTexture.wrapT = THREE.RepeatWrapping
  grassAmbientOcclusionTexture.repeat.set(8, 8)
  grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
  grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
  grassNormalTexture.repeat.set(8, 8)
  grassNormalTexture.wrapS = THREE.RepeatWrapping
  grassNormalTexture.wrapT = THREE.RepeatWrapping
  grassRoughnessTexture.repeat.set(8, 8)
  grassRoughnessTexture.wrapS = THREE.RepeatWrapping
  grassRoughnessTexture.wrapT = THREE.RepeatWrapping
  /**
 * House
 */
  // house group
  const houseGroup = new THREE.Group()
  scene.add(houseGroup)
  // 房子的墙
  const wallHeight = 2.5
  const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, wallHeight, 4),
    new THREE.MeshStandardMaterial({
      color: '#ac8e82',
      map: wallColorTexture,
      normalMap: wallNormalTexture,
      roughnessMap: wallRoughnessTexture,
      aoMap: wallAmbientOcclusionTexture,
      aoMapIntensity: 1
    })
  )
  walls.geometry.setAttribute('uv2', new THREE.BufferAttribute(walls.geometry.attributes.uv.array, 2))
  walls.position.y = wallHeight * 0.5
  walls.castShadow = true
  houseGroup.add(walls)
  // 屋顶
  const roofHeight = 1.5
  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, roofHeight, 4),
    new THREE.MeshStandardMaterial({
      color: '#ac8e82',
      map: wallColorTexture,
      normalMap: wallNormalTexture,
      roughnessMap: wallRoughnessTexture,
      aoMap: wallAmbientOcclusionTexture,
      aoMapIntensity: 1
    })
  )
  roof.rotation.y = Math.PI * 0.25
  roof.position.y = wallHeight + roofHeight * 0.5
  houseGroup.add(roof)
  // 门
  const doorHeight = 1.4
  const door = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, doorHeight, 100, 100),
    new THREE.MeshStandardMaterial({
      map: doorColorTexture,
      metalnessMap: doorMatalnessTexture,
      roughnessMap: doorRoughnessTexture,
      transparent: true,
      alphaMap: doorAlphaTexture,
      displacementMap: doorHeightTexture,
      displacementScale: 0.1,
      normalMap: doorNormalTexture,
      normalScale: new THREE.Vector2(0.5, 0.5),
      aoMap: doorAmbientOcclusionTexture,
      aoMapIntensity: 1
    })
  )
  door.geometry.setAttribute('uv2', new THREE.BufferAttribute(door.geometry.attributes.uv.array, 2))
  door.position.z = 2 + 0.01
  door.position.y = (doorHeight * 0.5) - 0.1
  houseGroup.add(door)
  // 门上的灯
  const doorLight = new THREE.PointLight(0xFF7D46, 1, 7)
  doorLight.position.set(0, 2.2, 2.7)
  doorLight.castShadow = true
  doorLight.shadow.mapSize.set(256, 256)
  doorLight.shadow.camera.far = 7
  houseGroup.add(doorLight)
  // 灌木丛
  const bushGroup = new THREE.Group()
  const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
  const bushMatrial = new THREE.MeshStandardMaterial({ color: '#89c854' })
  const bush1 = new THREE.Mesh(bushGeometry, bushMatrial)
  bush1.scale.set(0.5, 0.5, 0.5)
  bush1.position.set(0.8, 0.2, 2.2)
  bush1.castShadow = true
  const bush2 = new THREE.Mesh(bushGeometry, bushMatrial)
  bush2.scale.set(0.25, 0.25, 0.25)
  bush2.position.set(1.25, 0, 2.6)
  bush2.castShadow = true
  const bush3 = new THREE.Mesh(bushGeometry, bushMatrial)
  bush3.scale.set(0.4, 0.4, 0.4)
  bush3.position.set(1.5, -0.1, 2.2)
  bush3.castShadow = true
  bushGroup.add(bush1, bush2, bush3)
  const bushGroup2 = bushGroup.clone()
  bushGroup2.position.set(-2, 0, 1)
  bushGroup2.scale.set(0.8, 0.8, 0.8)
  // bushGroup2.rotation.y = Math.PI * 0.5
  // bushGroup2.rotateY(30)
  houseGroup.add(bushGroup, bushGroup2)
  // 墓地
  const graves = new THREE.Group()
  scene.add(graves)
  const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
  const graveMatrial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' })
  for (let index = 0; index < 50; index++){
    const angle = Math.random() * Math.PI * 2 // 随机角度
    const radius = 3 + Math.random() * 6
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius

    const grave = new THREE.Mesh(graveGeometry, graveMatrial)
    grave.position.set(x, 0.3, z)
    grave.rotation.z = (Math.random() - 0.5) * 0.4
    grave.rotation.y = (Math.random() - 0.5) * 0.4
    grave.castShadow = true
    graves.add(grave)
  }

  // Floor
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
      color: '#a9c388',
      map: grassColorTexture,
      normalMap: grassNormalTexture,
      roughnessMap: grassRoughnessTexture,
      aoMap: grassAmbientOcclusionTexture,
      aoMapIntensity: 1
    })
  )
  floor.rotation.x = -Math.PI * 0.5
  floor.position.y = 0
  floor.geometry.setAttribute('uv2', new THREE.BufferAttribute(floor.geometry.attributes.uv.array, 2))
  floor.receiveShadow = true
  scene.add(floor)
  createMeshStandardMaterialGui(gui, floor.material)

  /**
 * Lights
 */
  // Ambient light
  const ambientLight = new THREE.AmbientLight('#b9dfff', 0.12)
  scene.add(ambientLight)

  // Directional light
  const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
  moonLight.position.set(4, 5, -2)
  moonLight.castShadow = true
  moonLight.shadow.mapSize.set(256, 256)
  moonLight.shadow.camera.far = 15
  scene.add(moonLight)

  // 使用点光源伪造的鬼魂..
  const ghost = new THREE.PointLight('#ff00ff', 2, 3)
  ghost.castShadow = true
  ghost.shadow.mapSize.set(256, 256)
  ghost.shadow.camera.far = 7
  scene.add(ghost)
  // const ghostHelper = new THREE.PointLightHelper(ghost)
  // scene.add(ghostHelper)
  const ghost1 = new THREE.PointLight('#fff00f', 2, 3)
  ghost1.castShadow = true
  ghost1.shadow.mapSize.set(256, 256)
  ghost1.shadow.camera.far = 7
  scene.add(ghost1)
  // const ghost1Helper = new THREE.PointLightHelper(ghost1)
  // scene.add(ghost1Helper)
  const ghost2 = new THREE.PointLight('#00ff00', 2, 3)
  ghost2.castShadow = true
  ghost2.shadow.mapSize.set(256, 256)
  ghost2.shadow.camera.far = 7
  scene.add(ghost2)
  // const ghost2Helper = new THREE.PointLightHelper(ghost2)
  // scene.add(ghost2Helper)

  /**
   * 雾
   */
  const fog = new THREE.Fog('#262837', 1, 15)
  createFogGui(gui, fog)
  scene.fog = fog

  /**
   * camera
   */
  const camera = new THREE.PerspectiveCamera(75, aspect.value, 0.1, 100)
  camera.position.set(4, 2, 5)
  scene.add(camera)
  /**
   * renderer
   */
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasEl
  })
  renderer.setSize(width.value, height.value)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // 设置像素比
  renderer.setClearColor('#262837') // 更改颜色更接近于森林的颜色
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  /**
   * controls
   */
  const controls = new OrbitControls(camera, canvasEl)
  controls.enableDamping = true

  const clock = new THREE.Clock()
  const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    // 鬼魂移动
    const gohstAngle = elapsedTime * 0.5
    ghost.position.set(Math.cos(gohstAngle) * 4, Math.sin(elapsedTime * 3), Math.sin(gohstAngle) * 4)
    const ghost1Angle = elapsedTime * 0.3
    ghost1.position.set(Math.sin(ghost1Angle) * 5, Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5), Math.cos(ghost1Angle) * 5)
    const ghost2Angle = -elapsedTime * 0.18
    ghost2.position.set(Math.cos(ghost2Angle) * (7 + Math.sin(elapsedTime * 0.32)), Math.sin(elapsedTime * 5) + Math.sin(elapsedTime * 2), Math.sin(ghost2Angle) * (7 + Math.sin(elapsedTime * 2.5)))
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
  }
  tick()
  const handleResize = () => {
    renderer.setSize(width.value, height.value)
    camera.aspect = aspect.value
    camera.updateProjectionMatrix()
  }
  window.addEventListener('resize', handleResize)

  createAmbientLightGui(gui, ambientLight)
  createDirectionalLightGui(gui, moonLight)
}
