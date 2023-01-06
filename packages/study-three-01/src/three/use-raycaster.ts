/*
 * @Desc: 光线投射器
 * 向特定方向投射(或射出)光线，并测试哪些物体与其相交。
 * 你可以使用这种技术来检测玩家面前是否有一堵墙，
 * 测试激光枪是否击中了什么东西，
 * 测试当前鼠标下是否有什么东西来模拟鼠标事件，以及许多其他事情。
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

  /**
 * Objects
 */
  const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
  )
  object1.position.x = -2

  const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
  )

  const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
  )
  object3.position.x = 2

  scene.add(object1, object2, object3)

  /**
   * raycaster
   */
  const rayOrigin = new THREE.Vector3(-3, 0, 0) // 射线起始点
  const rayDirection = new THREE.Vector3(10, 0, 0) // 射线射向的方向
  rayDirection.normalize() // 将方向转为单位向量 (1,0,0)
  //   console.log(rayDirection)

  const raycaster = new THREE.Raycaster() // 射线对象
  //   raycaster.set(rayOrigin, rayDirection)

  //   const intersect = raycaster.intersectObject(object1)
  //   console.log(intersect)

  //   const intersects = raycaster.intersectObjects([object1, object2, object3])
  //   console.log(intersects)

  const mouse = new THREE.Vector2()

  /**
   * camera
   */
  const camera = new THREE.PerspectiveCamera(75, aspect.value, 0.1, 100)
  camera.position.set(0, 0, 3)
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

  let currentIntersect: THREE.Intersection<THREE.Object3D<THREE.Event>> | mull = null
  const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // update objects
    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
    object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
    object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5

    // create raycaster
    // raycaster.set(rayOrigin, rayDirection)
    // 设置相机为起始点 鼠标为方向
    raycaster.setFromCamera(mouse, camera)
    const objectToTest = [object1, object2, object3]
    const intersects = raycaster.intersectObjects(objectToTest)
    // 更新相交的对象的颜色
    // for (const object of objectToTest)
    //   object.material.color.set('#ff0000')
    // for (const intersect of intersects)
    //   intersect.object.material.color.set('#0000ff')
    // console.log(intersects)
    if (intersects.length){
    //   console.log('有东西')
      if (currentIntersect === null)
        console.log('mouse enter')

      currentIntersect = intersects[0]
    } else {
    //   console.log('没东西')
      if (currentIntersect)
        console.log('mouse leave')

      currentIntersect = null
    }

    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
  }

  tick()

  const handleClick = (event: MouseEvent) => {
    if (currentIntersect){
      switch (currentIntersect.object){
        case object1:
          console.log('click on object1')
          break
        case object2:
          console.log('click on object2')
          break
        case object3:
          console.log('click on object3')
          break
      }
    }
  }
  const handleResize = () => {
    renderer.setSize(width.value, height.value)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    camera.aspect = aspect.value
    camera.updateProjectionMatrix()
  }
  window.addEventListener('resize', handleResize)

  window.addEventListener('mousemove', (event) => {
    // mouse的x和y范围在 -1 ~ 1之间
    mouse.x = event.clientX / width.value * 2 - 1
    mouse.y = -(event.clientY / height.value * 2 - 1)
    // console.log(mouse)
  })
  window.addEventListener('click', handleClick)
}
