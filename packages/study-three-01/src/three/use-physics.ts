/*
 * @Desc: 银河生成
 */
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import useGui from '../hooks/useGui'
import * as CANNON from 'cannon-es'
export default (
  canvasEl: Ref<HTMLCanvasElement>,
  width: Ref<number>,
  height: Ref<number>
) => {
  const hitSound = new Audio('../../public/assets/sounds/hit.mp3')
  const playHitSound = () => {
    hitSound.volume = Math.random() // 随机音量
    hitSound.currentTime = 0 // 时间轴归回0
    hitSound.play()
  }
  /**
   * 创建gui对象
   */
  const { gui } = useGui()
  const debugObject = {
    createSphere: () => {
      createSphere(
        Math.random() * 0.5
        ,
        {
          x: (Math.random() - 0.5) * 3,
          y: 3,
          z: (Math.random() - 0.5) * 3
        }
      )
    },
    createBox: () => {
      createBox(
        Math.random() * 0.5,
        Math.random() * 0.5,
        Math.random() * 0.5,
        {
          x: (Math.random() - 0.5) * 3,
          y: 3,
          z: (Math.random() - 0.5) * 3
        }
      )
    },
    reset: () => {
      removeObjects()
    }
  }
  gui.add(debugObject, 'createSphere')
  gui.add(debugObject, 'createBox')
  gui.add(debugObject, 'reset')
  /**
   * 创建物理世界
   */
  const world = new CANNON.World()
  /**
   * 添加重力
   */
  world.gravity.set(0, -9.82, 0)
  /**
   * 更改测试类型
   */
  world.broadphase = new CANNON.SAPBroadphase(world)
  /**
   * 开启睡眠
   * 不动的物体将会进入睡眠
   */
  world.allowSleep = true
  /**
   * 物理材质
   */
  // const concreteMaterial = new CANNON.Material('concrete') // 混凝土
  // const plasticMaterial = new CANNON.Material('plastic') // 塑料
  /**
   * 关联材质
   * 定义两种材料相遇时发生的情况
   */
  // const concretePlasticContactMaterial = new CANNON.ContactMaterial(
  //   concreteMaterial,
  //   plasticMaterial,
  //   {
  //     friction: 0.1, // 摩擦力
  //     restitution: 0.7// 补偿（反弹力） 1为弹至原始位置
  //   }
  // )
  // world.addContactMaterial(concretePlasticContactMaterial)
  /**
   * 或者创建默认材质
   * 使用一种材质
   */
  const defaultMaterial = new CANNON.Material('default')
  const defaultContactMatertial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
      friction: 0.1,
      restitution: 0.7
    }
  )
  world.addContactMaterial(defaultContactMatertial)
  // 设置这个世界的默认材质关联
  world.defaultContactMaterial = defaultContactMatertial
  /**
   * 创建物理球体形状
   */
  // const sphereShape = new CANNON.Sphere(0.5)
  // const sphereBody = new CANNON.Body({
  //   mass: 1, // 质量
  //   position: new CANNON.Vec3(0, 3, 0),
  //   shape: sphereShape
  //   // material: defaultMaterial
  // })
  // // 添加一个往x轴正方向上的局部 力量，作用点在球体的正中心
  // sphereBody.applyLocalForce(new CANNON.Vec3(150, 0, 0), new CANNON.Vec3(0, 0, 0))
  // world.addBody(sphereBody)
  /**
   * 创建物理地板形状
   */
  const floorShape = new CANNON.Plane()
  const floorBody = new CANNON.Body({
    mass: 0
  })
  floorBody.addShape(floorShape)
  // floorBody.material = defaultMaterial
  // 旋转物理世界的地板 设置给定轴和角度
  floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5)
  world.addBody(floorBody)

  const aspect = computed(() => width.value / height.value)
  const scene = new THREE.Scene()
  scene.add(new THREE.AxesHelper(20))
  /**
 * Textures
 */
  const textureLoader = new THREE.TextureLoader()
  const cubeTextureLoader = new THREE.CubeTextureLoader()

  const environmentMapTexture = cubeTextureLoader.load([
    '../assets/textures/environmentMaps/0/px.png',
    '../assets/textures/environmentMaps/0/nx.png',
    '../assets/textures/environmentMaps/0/py.png',
    '../assets/textures/environmentMaps/0/ny.png',
    '../assets/textures/environmentMaps/0/pz.png',
    '../assets/textures/environmentMaps/0/nz.png'
  ])

  /**
 * Test sphere
 */
  // const sphere = new THREE.Mesh(
  //   new THREE.SphereGeometry(0.5, 32, 32),
  //   new THREE.MeshStandardMaterial({
  //     metalness: 0.3,
  //     roughness: 0.4,
  //     envMap: environmentMapTexture,
  //     envMapIntensity: 0.5
  //   })
  // )
  // sphere.castShadow = true
  // sphere.position.y = 0.5
  // scene.add(sphere)

  /**
 * Floor
 */
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
      color: '#777777',
      metalness: 0.3,
      roughness: 0.4,
      envMap: environmentMapTexture,
      envMapIntensity: 0.5
    })
  )
  floor.receiveShadow = true
  floor.rotation.x = -Math.PI * 0.5
  scene.add(floor)

  /**
 * Lights
 */
  const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.7)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.2)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.set(1024, 1024)
  directionalLight.shadow.camera.far = 15
  directionalLight.shadow.camera.left = -7
  directionalLight.shadow.camera.top = 7
  directionalLight.shadow.camera.right = 7
  directionalLight.shadow.camera.bottom = -7
  directionalLight.position.set(5, 5, 5)
  scene.add(directionalLight)
  /**
   * camera
   */
  const camera = new THREE.PerspectiveCamera(75, aspect.value, 0.1, 100)
  camera.position.set(-3, 3, 3)
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

  /**
   * controls
   */
  const controls = new OrbitControls(camera, canvasEl)
  controls.enableDamping = true

  const updateObjArr: {mesh: THREE.Mesh; body: CANNON.Body}[] = []
  const handleCollide = (collide) => {
    /**
       * 获得沿正常方向的冲击速度
       */
    const impactStrength: number = collide?.contact?.getImpactVelocityAlongNormal() as number || 0
    if (impactStrength > 1.5) playHitSound()

    /**
           * after
           * 可以根据不同的冲击力播放不同的冲撞声音
           * 不同材质的碰撞，声音该不同
           */
  }
  /**
   * 创建球体
   * @param radius
   * @param position
   */
  const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
  const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture
  })
  const createSphere = (radius: number, position: THREE.Vector3) => {
    // three.js的球体
    const sphere = new THREE.Mesh(
      sphereGeometry,
      sphereMaterial
    )
    sphere.scale.set(radius, radius, radius)
    sphere.castShadow = true
    sphere.position.copy(position)
    scene.add(sphere)
    // 物理里的球体
    const sphereBody = new CANNON.Body({
      mass: 1,
      // position: new CANNON.Vec3(0, 3, 0),
      shape: new CANNON.Sphere(radius)
    })
    sphereBody.position.copy(position)
    /**
     * 添加碰撞事件
     */
    sphereBody.addEventListener('collide', handleCollide)
    world.addBody(sphereBody)
    // 插入数据
    updateObjArr.push({
      mesh: sphere,
      body: sphereBody
    })
  }

  /**
   * 创建立方体
   */
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
  const boxMeterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.5,
    envMap: environmentMapTexture
  })
  // const box = new THREE.Mesh(boxGeometry, boxMeterial)
  // scene.add(box)
  const createBox = (width: number, height: number, depth: number, position: THREE.Vector3) => {
    // three里的盒子
    const box = new THREE.Mesh(boxGeometry, boxMeterial)
    box.scale.set(width, height, depth)
    box.castShadow = true
    box.position.copy(position)
    scene.add(box)
    // 物理世界的盒子
    const boxBody = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5))
    })
    boxBody.position.copy(position)
    /**
     * 添加碰撞事件
     */
    boxBody.addEventListener('collide', handleCollide)
    world.addBody(boxBody)
    // 插入数据
    updateObjArr.push({
      mesh: box,
      body: boxBody
    })
  }

  /**
   * 移除物体对象
   */
  const removeObjects = () => {
    updateObjArr.forEach(({ mesh, body }) => {
      // 移除物理
      body.removeEventListener('collide', handleCollide)
      world.removeBody(body)
      // 移除three
      scene.remove(mesh)
    })
  }

  /**
 * 动画
 */
  const clock = new THREE.Clock()
  let oldTime = 0
  const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldTime
    oldTime = elapsedTime
    // 在物理世界更新之前，模拟风
    // sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position)
    // update 物理世界
    world.step(1 / 60, deltaTime, 3)
    // console.log(sphereBody.position.y)
    // 将物理世界的球体位置坐标 更新至 three.js的球体上
    // sphere.position.copy(sphereBody.position)
    updateObjArr.forEach(({ mesh, body }) => {
      // 物理位置
      mesh.position.copy(body.position)
      // 物理旋转（由碰撞产生的旋转）
      mesh.quaternion.copy(body.quaternion)
    })

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
