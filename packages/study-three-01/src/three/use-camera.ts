/*
 * @Desc: 相机
 */
import * as THREE from "three";
export default (canvasEl: HTMLCanvasElement, width: number, height: number) => {
  const cursor = {
    x: 0,
    y: 0,
  };
  canvasEl.addEventListener("mousemove", (event) => {
    cursor.x = event.clientX / width - 0.5; // 正负。
    cursor.y = -(event.clientY / height - 0.5);
    // console.log(cursor.x,cursor.y)
  });
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
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  );
  group.add(cube1);

  /**
   * 辅助坐标系
   */
  //   const axesHelper = new THREE.AxesHelper(5);
  //   scene.add(axesHelper);

  /**
   * 相机
   */

  const camera = new THREE.PerspectiveCamera(75, width / height, 1, 100);

  //   const camera = new THREE.OrthographicCamera(-10, 10, 10, -10);

  //   const aspectRation = width / height;
  //   const camera = new THREE.OrthographicCamera(
  //     -10 * aspectRation,
  //     10 * aspectRation,
  //     10,
  //     -10
  //   );
  camera.position.z = 2;
  scene.add(camera);
  //   camera.lookAt(group.position);
  // camera.lookAt(new THREE.Vector4())

  /**
   * 渲染器
   */
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasEl,
  });
  renderer.setSize(width, height);

  const clock = new THREE.Clock();
  const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // camera.position.x = cursor.x * 10;
    // camera.position.y = cursor.y * 10;

    camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
    camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
    camera.position.y = cursor.y * 3;
    camera.lookAt(group.position);
    // camera.lookAt(new THREE.Vector3())
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  };
  tick();
};
