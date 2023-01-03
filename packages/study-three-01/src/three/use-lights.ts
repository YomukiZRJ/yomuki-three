/*
 * @Desc: 材质
 */
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'
import * as dat from 'dat.gui'

export default (
  canvasEl: Ref<HTMLCanvasElement>,
  width: Ref<number>,
  height: Ref<number>
) => {
  const debugObj = {
    play: true,
    isAmbient: false,
    isDirection: false,
    isHemisphere: false,
    isPoint: false,
    isRectArea: false,
    isSpot: false
  }
  const gui = new dat.GUI()
  gui.add(debugObj, 'play').name('是否开启动画')
  const aspect = computed(() => width.value / height.value)
  const scene = new THREE.Scene()
  const group = new THREE.Group()
  scene.add(group)

  /**
 * Lights
 */

  /**
   * 环境光
   * 均匀的照亮所有物体
   * 不能投射阴影，因为没有方向
   */
  const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5)
  //   scene.add(ambientLight)
  gui.add(debugObj, 'isAmbient').name('是否开启环境光')
    .onChange((val) => {
      if (val)
        scene.add(ambientLight)
      else
        scene.remove(ambientLight)
    })

  /**
   * 平行光
   * 从特定点发射出无限远的光
   * 像太阳，可以投射阴影
   */
  const directionLight = new THREE.DirectionalLight(0x00FFFC, 0.3)
  directionLight.position.set(1, 0.25, 0)
  const directionLightHelper = new THREE.DirectionalLightHelper(directionLight, 0.1)
  scene.add(directionLightHelper)
  const directionFolder = gui.addFolder('平行光')
  directionFolder.add(debugObj, 'isDirection').name('是否开启平行光')
    .onChange((val) => {
      if (val)
        scene.add(directionLight)
      else
        scene.remove(directionLight)
    })
  directionFolder.add(directionLight.position, 'x').max(10)
    .min(-10)
    .step(0.01)
  directionFolder.add(directionLight.position, 'y').max(10)
    .min(-10)
    .step(0.01)
  directionFolder.add(directionLight.position, 'z').max(10)
    .min(-10)
    .step(0.01)
  //   scene.add(directionLight)

  /**
   * 半球光
   * 不能投射阴影
   * 从天空光线渐变到地面光线
   */
  const hemisphereLight = new THREE.HemisphereLight(0xFF0000, 0x0000FF, 0.3)
  const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2) // 灯光帮助
  scene.add(hemisphereLightHelper)
  const hemisphereFolder = gui.addFolder('半球光')
  hemisphereFolder.add(debugObj, 'isDirection').name('是否开启半球光')
    .onChange((val) => {
      if (val)
        scene.add(hemisphereLight)
      else
        scene.remove(hemisphereLight)
    })
  //   scene.add(hemisphereLight)

  /**
   * 点光源
   * 从一个点，向周围各个方向射出
   * 可以投射阴影
   */
  const pointLight = new THREE.PointLight(0xFF9000, 0.5)
  pointLight.position.set(1, 0.5, 1)
  const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.1)
  scene.add(pointLightHelper)
  const pointFolder = gui.addFolder('点光源')
  pointFolder.add(debugObj, 'isPoint').name('是否开启点光源')
    .onChange((val) => {
      if (val)
        scene.add(pointLight)
      else
        scene.remove(pointLight)
    })
  pointFolder.add(pointLight.position, 'x').max(10)
    .min(-10)
    .step(0.01)
  pointFolder.add(pointLight.position, 'y').max(10)
    .min(-10)
    .step(0.01)
  pointFolder.add(pointLight.position, 'z').max(10)
    .min(-10)
    .step(0.01)
  // 控制灯到哪里不亮了
  pointFolder.add(pointLight, 'distance').max(30)
    .min(0)
    .step(0.01)
    .name('距离')
  pointFolder.add(pointLight, 'decay').max(30)
    .min(0)
    .step(0.01)
    .name('衰退距离')
  //   scene.add(pointLight)

  /**
   * 平面光
   * 不能投射阴影
   * 只支持 MeshStandardMaterial 和 MeshPhysicalMaterial 两种材质。
   */
  const rectAreaLight = new THREE.RectAreaLight(0x4E00FF, 2, 1, 1)
  rectAreaLight.position.set(-1.5, 0, 1.5)
  rectAreaLight.lookAt(new THREE.Vector3())
  //   scene.add(rectAreaLight)
  const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
  scene.add(rectAreaLightHelper)
  const rectAreaFolder = gui.addFolder('平面光')
  rectAreaFolder.add(debugObj, 'isRectArea').name('是否开启平面光')
    .onChange((val) => {
      if (val)
        scene.add(rectAreaLight)
      else
        scene.remove(rectAreaLight)
    })
  rectAreaFolder.add(rectAreaLight.position, 'x').max(10)
    .min(-10)
    .step(0.01)
  rectAreaFolder.add(rectAreaLight.position, 'y').max(10)
    .min(-10)
    .step(0.01)
  rectAreaFolder.add(rectAreaLight.position, 'z').max(10)
    .min(-10)
    .step(0.01)

  /**
     * 聚光灯
     */
  const spotLight = new THREE.SpotLight(0x78FF00, 0.5, 10, Math.PI * 0.1, 0.25, 1)
  spotLight.target.position.set(-0.75, 0, 0)// 改变聚光灯的照射目标方向
  scene.add(spotLight.target) // 得将这个照射对象加在场景中
  const spotLightHelper = new THREE.SpotLightHelper(spotLight)
  scene.add(spotLightHelper)
  //   scene.add(spotLight)
  const spotFolder = gui.addFolder('聚光灯')
  spotFolder.add(debugObj, 'isSpot').name('是否开启聚光灯')
    .onChange((val) => {
      if (val)
        scene.add(spotLight)
      else
        scene.remove(spotLight)
    })
  spotFolder.add(spotLight.position, 'x').max(10)
    .min(-10)
    .step(0.01)
  spotFolder.add(spotLight.position, 'y').max(10)
    .min(-10)
    .step(0.01)
  spotFolder.add(spotLight.position, 'z').max(10)
    .min(-10)
    .step(0.01)
  // 控制灯到哪里不亮了
  spotFolder.add(spotLight, 'distance').max(30)
    .min(0)
    .step(0.01)
    .name('距离')
  // 控制聚光灯角度
  spotFolder.add(spotLight, 'angle').max(Math.PI / 2)
    .min(0)
    .step(0.01)
    .name('角度')
    // 衰减百分比
  spotFolder.add(spotLight, 'penumbra').max(1)
    .min(0)
    .step(0.001)
    .name('衰减百分比')
  // 变暗距离
  spotFolder.add(spotLight, 'decay').max(10)
    .min(0)
    .step(0.01)
    .name('变暗距离')
  spotFolder.add(spotLight.target.position, 'x').max(10)
    .min(-10)
    .step(0.01)
    .name('照射目标x')
  spotFolder.add(spotLight.target.position, 'y').max(10)
    .min(-10)
    .step(0.01)
    .name('照射目标y')
  spotFolder.add(spotLight.target.position, 'z').max(10)
    .min(-10)
    .step(0.01)
    .name('照射目标z')

  /**
 * Objects
 */
  // Material
  const material = new THREE.MeshStandardMaterial()
  material.roughness = 0.4

  // Objects
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
  )
  sphere.position.x = -1.5

  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
  )

  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
  )
  torus.position.x = 1.5

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
  )
  plane.rotation.x = -Math.PI * 0.5
  plane.position.y = -0.65

  group.add(sphere, cube, torus, plane)

  const camera = new THREE.PerspectiveCamera(75, aspect.value, 0.1, 100)
  camera.position.set(1, 1, 2)
  scene.add(camera)

  const renderer = new THREE.WebGLRenderer({
    canvas: canvasEl
  })
  renderer.setSize(width.value, height.value)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // 设置像素比

  const controls = new OrbitControls(camera, canvasEl)
  controls.enableDamping = true
  const clock = new THREE.Clock()
  const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    if (debugObj.play){
      sphere.rotation.y = 0.1 * elapsedTime
      cube.rotation.y = 0.1 * elapsedTime
      torus.rotation.y = 0.1 * elapsedTime

      sphere.rotation.x = 0.15 * elapsedTime
      cube.rotation.x = 0.15 * elapsedTime
      torus.rotation.x = 0.15 * elapsedTime
    }
    spotLightHelper.update() // 当聚光灯的照射目标更新时，其辅助工具也需要更新下

    rectAreaLightHelper.position.copy(rectAreaLight.position)
    rectAreaLightHelper.quaternion.copy(rectAreaLight.quaternion)

    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
  }
  tick()
  /**
   * 处理窗口大小变更
   */
  const handleResize = () => {
    renderer.setSize(width.value, height.value)
    camera.aspect = aspect.value // 重新赋值照相机的aspect
    camera.updateProjectionMatrix() // 更新投影矩阵
  }
  window.addEventListener('resize', handleResize)
}
