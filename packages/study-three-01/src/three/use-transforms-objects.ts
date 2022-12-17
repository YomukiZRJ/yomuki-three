/*
 * @Desc: 改变对象
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
  const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xfff000 })
  );
  cube2.position.x=2
  group.add(cube2);
  const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x00ffff })
  );
  cube3.position.x=-2
  group.add(cube3);

  group.scale.x=.8 // 整个组缩放
  group.position.y=1
  // const geometry = new THREE.BoxGeometry(1, 1, 1);
  // const material = new THREE.MeshBasicMaterial({
  //   color: 0xff0000,
  // });
  // const mesh = new THREE.Mesh(geometry, material);
  // scene.add(mesh);

  // // position
  // mesh.position.set(1.4,-0.8,1.5)
  // console.log('before normalize length',mesh.position.length()) // 从(0,0,0)到(x,y,z)的欧几里得长度 @see https://threejs.org/docs/index.html?q=Objec#api/zh/math/Vector3
  // // console.log('distanceTo',mesh.position.distanceTo(new THREE.Vector3(0,0,5)))// 到某个点的距离
  // mesh.position.normalize() // 将该向量的方向设置为和原向量相同，但是其长度（position.length()）为1
  // console.log('after normalize length',mesh.position.length())

  // scale
  // mesh.scale.x = .5
  // mesh.scale.y=1.3
  // mesh.scale.set(0.5,1,2)

  // rotation
  // mesh.rotation.reorder('YXZ') // 设置旋转轴路径，先操作y轴，再操作x轴，最后z轴
  // mesh.rotation.x = Math.PI * 0.25
  // mesh.rotation.y = Math.PI * 0.5 // 转一圈是2π

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
  renderer.render(scene, camera);
};
