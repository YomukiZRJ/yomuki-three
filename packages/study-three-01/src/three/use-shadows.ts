/*
 * @Desc: 阴影
 */
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import useGui from '../hooks/useGui'
import { createAmbientLightGui, createDirectionalLightGui, createMeshStandardMaterialGui, createSpotLightGui } from '../helper/guiHelper'
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
   * 阴影贴图
   */
  const shadowTexture = new THREE.TextureLoader().load('../assets/shadows/simpleShadow.jpg')

  /**
 * Lightsxx
 */
  // Ambient light
  const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5)
  scene.add(ambientLight)

  // Directional light
  const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.5)
  directionalLight.visible = true
  directionalLight.position.set(2, 2, -1)
  directionalLight.castShadow = true // 开启阴影投射
  /**
   * 设置阴影贴图的大小 默认值是512
   * 值越高，阴影越清晰
   */
  directionalLight.shadow.mapSize.width = 512 * 4
  directionalLight.shadow.mapSize.height = 512 * 4
  /**
   * 模糊半径
   * 不适用于 THREE.PCFSoftShadowMap 阴影类型
   */
  directionalLight.shadow.radius = 10 // 模糊半径
  /**
   * 设置阴影相机的远近
   * 平行光的阴影相机是个 OrthographicCamera 正交相机
   * 聚光灯的阴影相机是个 透视相机
   * 尽量缩小阴影相机的范围，来优化性能
   */
  //   console.log(directionalLight.shadow.camera)
  directionalLight.shadow.camera.near = 2
  directionalLight.shadow.camera.far = 5
  directionalLight.shadow.camera.top = 2
  directionalLight.shadow.camera.right = 2
  directionalLight.shadow.camera.bottom = -2
  directionalLight.shadow.camera.left = -2
  scene.add(directionalLight)

  const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera) // 添加相机辅助
  cameraHelper.visible = false
  scene.add(cameraHelper)

  /**
   * 聚光灯
   */
  const spotLight = new THREE.SpotLight(0xFFFFFF, 0.4, 10, Math.PI * 0.3)
  spotLight.position.set(0, 2, 2)
  spotLight.visible = false
  spotLight.castShadow = true
  spotLight.shadow.mapSize.width = 512 * 4
  spotLight.shadow.mapSize.height = 512 * 4
  /**
   * 聚光灯的相机是个透视相机
   */
  // console.log(spotLight.shadow.camera)
  spotLight.shadow.camera.fov = 20
  spotLight.shadow.camera.near = 2
  spotLight.shadow.camera.far = 6

  scene.add(spotLight)
  scene.add(spotLight.target)
  const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera) // 添加相机辅助
  spotLightCameraHelper.visible = false
  scene.add(spotLightCameraHelper)

  /**
 * Materials
 */
  const material = new THREE.MeshStandardMaterial()
  material.roughness = 0.7

  /**
 * Objects
 */
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
  )

  sphere.castShadow = true // 开启阴影投射
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
  )
  plane.rotation.x = -Math.PI * 0.5
  plane.position.y = -0.5
  plane.receiveShadow = true // 开启阴影接收

  const sphereShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
      alphaMap: shadowTexture,
      transparent: true,
      color: 0x000000
    })
  )
  sphereShadow.rotation.x = -Math.PI * 0.5
  sphereShadow.position.y = plane.position.y + 0.01

  scene.add(sphere, plane, sphereShadow)

  const camera = new THREE.PerspectiveCamera(75, aspect.value, 0.1, 100)
  camera.position.z = 10
  scene.add(camera)
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasEl
  })
  renderer.setSize(width.value, height.value)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // 设置像素比

  /**
   * 允许阴影渲染
   */
  renderer.shadowMap.enabled = false
  /**
   * 阴影贴图类型
   * BasicShadowMap 高性能，低品质
   * PCFShadowMap 默认值。低性能，品质还行
   * PCFSoftShadowMap 低性能，柔软的部位表现更好
   * VSMShadowMap 低性能，更受约束。
   */
  renderer.shadowMap.type = THREE.PCFShadowMap

  const controls = new OrbitControls(camera, canvasEl)
  controls.enableDamping = true

  const clock = new THREE.Clock()
  const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // update object
    sphere.position.x = Math.cos(elapsedTime) * 1.5
    sphere.position.z = Math.sin(elapsedTime) * 1.5
    sphere.position.y = Math.abs(Math.sin(elapsedTime) * 3)

    // 更新阴影
    sphereShadow.position.x = sphere.position.x
    sphereShadow.position.z = sphere.position.z
    sphereShadow.material.opacity = (1 - Math.abs(sphere.position.y)) * 0.5
    cameraHelper.update()
    spotLightCameraHelper.update()
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

  /**
   * 调试面板
   */
  createAmbientLightGui(gui, ambientLight)
  createDirectionalLightGui(gui, directionalLight)
  createSpotLightGui(gui, spotLight)
  createMeshStandardMaterialGui(gui, material)
}
