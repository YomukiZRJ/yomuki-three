/*
 * @Desc: 3d文字
 */
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import facetype from 'three/examples/fonts/gentilis_bold.typeface.json'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'

export default (
  canvasEl: Ref<HTMLCanvasElement>,
  width: Ref<number>,
  height: Ref<number>
) => {
  const aspect = computed(() => width.value / height.value)
  const scene = new THREE.Scene()
  // const x = new THREE.AxesHelper(10)
  // scene.add(x)
  const group = new THREE.Group()
  scene.add(group)
  const matcapTexture = new THREE.TextureLoader().load('../assets/matcaps/8.png')
  const matcapMaterial = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture
  })
  /**
   * 使用FontLoader载入typeface
   */
  const fontLoader = new FontLoader()
  fontLoader.load(
    '../fonts/helvetiker_regular.typeface.json',
    (font) => {
      console.log('onload', font)
      /**
       * 更改curveSegments和bevelSegments来优化性能
       */
      const bevelThickness = 0.03
      const bevelSize = 0.02
      const textGeometry = new TextGeometry('Yomuki 2023', {
        font,
        size: 3,
        height: 1,
        curveSegments: 6,
        bevelEnabled: true, // 是否开启斜角
        bevelThickness, // 文本上斜角的深度
        bevelSize, // 斜角与原始文本轮廓之间的延伸距离
        bevelSegments: 4// 斜角的分段数
      })
      /**
       * 1.使用边界来使文字居中
       */
      // textGeometry.computeBoundingBox() // 计算边界盒子
      // console.log(textGeometry.boundingBox)
      /**
       * 查看移动后的边界盒子
       * 发现其实当前的位置并没有在最中心（视觉上看是在最中心）
       * 因为 bevelThickness 和 bevelSize
       * 所以 在做移动时，要减去对应的 bevelThickness 和 bevelSize
       */
      // textGeometry.translate(
      //   -(textGeometry.boundingBox?.max.x - bevelSize) * 0.5,
      //   -(textGeometry.boundingBox?.max.y - bevelSize) * 0.5,
      //   -(textGeometry.boundingBox?.max.z - bevelThickness) * 0.5
      // )// 使用translate移动几何体
      // textGeometry.computeBoundingBox() // 重新计算下移动后的边界盒子
      // console.log(textGeometry.boundingBox)

      /**
       * 2.直接使用three提供的api来使几何体居中
       */
      textGeometry.center()

      // const baseMaterial = new THREE.MeshBasicMaterial()
      // baseMaterial.wireframe = true
      const textMesh = new THREE.Mesh(
        textGeometry,
        matcapMaterial
      )
      group.add(textMesh)
      createDounts(300)
    },
    (xhr) => {
      console.log('onProgress', xhr)
    },
    (err) => {
      console.log('on Error', err)
    }
  )
  /**
   * 创建周围的甜甜圈
   */
  const createDounts = (count = 100) => {
    console.time('dounts')
    const dountGeometry = new THREE.TorusGeometry(0.8, 0.5, 20, 45)
    const range = 28
    const dountGroup = new THREE.Group()
    for (let index = 0; index < count; index++){
      const dountMesh = new THREE.Mesh(dountGeometry, matcapMaterial)
      dountMesh.position.set((Math.random() - 0.5) * range, (Math.random() - 0.5) * range, (Math.random() - 0.5) * range)
      dountMesh.rotation.x = Math.random() * Math.PI
      dountMesh.rotation.y = Math.random() * Math.PI
      const scale = Math.random()
      dountMesh.scale.set(scale, scale, scale)
      dountGroup.add(dountMesh)
    }
    scene.add(dountGroup)
    console.timeEnd('dounts')
  }
  const camera = new THREE.PerspectiveCamera(75, aspect.value, 0.1, 1000)
  camera.position.z = 20
  scene.add(camera)
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasEl
  })
  renderer.setSize(width.value, height.value)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // 设置像素比

  const controls = new OrbitControls(camera, canvasEl)
  controls.enableDamping = true

  const tick = () => {
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
