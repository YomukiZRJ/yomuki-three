/*
 * 基于滚动的动画
 * 让摄像机跟着滚动转动
 * 在滚动到相应部分时触发某些动画
 * 作为html的背景，更炫酷
 */
import * as THREE from 'three'
import { BufferAttribute, BufferGeometry, Points, PointsMaterial } from 'three'
import gsap from 'gsap'
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

  /**
   * 滚动距离
   */
  const { y } = useWindowScroll()
  let currentSection = 0

  /**
   * 鼠标位置
   */
  const cursor = {
    x: 0,
    y: 0
  }

  const parameters = {
    materialColor: '#ffeded'
  }

  const aspect = computed(() => width.value / height.value)
  const scene = new THREE.Scene()

  /**
   * 纹理
   */
  const textureLoader = new THREE.TextureLoader()
  const gradientTexture = textureLoader.load('../assets/gradients/3.jpg')
  gradientTexture.magFilter = THREE.NearestFilter

  /**
 * 物体
 */
  // 材质
  const material = new THREE.MeshToonMaterial({
    color: parameters.materialColor,
    gradientMap: gradientTexture
  })

  // 对象
  const objectsDistance = 4 // 每个物体间的距离
  const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
  )
  const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
  )
  const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
  )
  mesh1.position.y = -objectsDistance * 0
  mesh2.position.y = -objectsDistance * 1
  mesh3.position.y = -objectsDistance * 2

  mesh1.position.x = 2
  mesh2.position.x = -2
  mesh3.position.x = 2

  scene.add(mesh1, mesh2, mesh3)

  const sectionMeshs = [mesh1, mesh2, mesh3]

  /**
   * 粒子
   */
  const pointsCount = 500
  const pointsPositions = []
  for (let index = 0; index < pointsCount; index++){
    pointsPositions.push(
      (Math.random() - 0.5) * 10,
      objectsDistance * 0.5 - (Math.random() * objectsDistance * sectionMeshs.length),
      (Math.random() - 0.5) * 5
    )
  }
  const pointsGeomtery = new BufferGeometry()
  pointsGeomtery.setAttribute('position', new BufferAttribute(new Float32Array(pointsPositions), 3))
  const points = new Points(
    pointsGeomtery,
    new PointsMaterial({ color: parameters.materialColor, size: 0.02 })
  )
  scene.add(points)

  /**
   * 灯
   */
  const dLight = new THREE.DirectionalLight(0xFFFFFF)
  dLight.position.set(1, 1, 0)
  scene.add(dLight)

  /**
   * camera
   */
  const cameraGroup = new THREE.Group()
  scene.add(cameraGroup)

  const camera = new THREE.PerspectiveCamera(35, aspect.value, 0.1, 100)
  camera.position.set(0, 0, 6)
  cameraGroup.add(camera)
  /**
   * renderer
   */
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasEl,
    alpha: true
  })
  renderer.setSize(width.value, height.value)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // 设置像素比

  const clock = new THREE.Clock()
  let previousTime = 0

  const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime // 距离上一帧的时间差 用来统一不同设备的动画速度
    previousTime = elapsedTime

    sectionMeshs.forEach((item) => {
      item.rotation.x += deltaTime * 0.1
      item.rotation.y += deltaTime * 0.1
    })

    camera.position.y = -(y.value / height.value) * objectsDistance

    const parallaxX = cursor.x * 0.5 // *0.5 减小下幅度
    const parallaxY = cursor.y * 0.5
    // cameraGroup.position.x  = parallaxX
    // 使跟随鼠标移动变得平滑，每帧移动目标距离的2%
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

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

  window.addEventListener('mousemove', (event) => {
    cursor.x = (event.clientX / width.value) - 0.5
    cursor.y = -((event.clientY / height.value) - 0.5)
  })

  /**
   * gui
   */
  gui
    .addColor(parameters, 'materialColor').onChange((val) => {
      material.color.set(val)
      points.material.color.set(val)
    })

  watch(() => y.value, (val) => {
    const nowSection = Math.round(val / height.value)

    if (nowSection !== currentSection){
      currentSection = nowSection
      gsap.to(
        sectionMeshs[nowSection].rotation,
        {
          duration: 1.5,
          ease: 'power2.inOut',
          x: '+=6',
          y: '+=3',
          z: '+=1.5'
        }
      )
    }
  })
}
