/*
 * @Desc: 动画
 */
import * as THREE from "three";
export default (canvasEl: HTMLCanvasElement, width: number, height: number) => {
  /**
   * 场景
   */
  const scene = new THREE.Scene();

  /**
   * 组
   */
  const group = new THREE.Group();
  scene.add(group);

  const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  );
  group.add(cube1);
  
  /**
   * 辅助坐标系
   */
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  /**
   * 相机
   */
  const camera = new THREE.PerspectiveCamera(75, width / height);
  camera.position.set(1, 1, 5);
  scene.add(camera);

  // camera.lookAt(mesh.position) // 让相机看向某个位置
  /**
   * 渲染器
   */
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasEl,
  });
  renderer.setSize(width, height);
  
  // Time
  // let time = Date.now()
  const clock = new THREE.Clock()

  const tick = () =>{
    // time 
    // const currentTime = Date.now()
    // const deltaTime = currentTime - time
    // time = currentTime
    const elapsedTime = clock.getElapsedTime() // 经过的时间，持续增长
    // 更新对象
    // group.position.x +=0.01
    group.rotation.y =elapsedTime * Math.PI * 2
    group.position.y = Math.sin(elapsedTime)
    group.position.x = Math.cos(elapsedTime)

    camera.lookAt(group.position)
    // 渲染
    renderer.render(scene, camera);
    // 帧动画。每一帧触发
    window.requestAnimationFrame(tick) 
  }
  tick()

};
