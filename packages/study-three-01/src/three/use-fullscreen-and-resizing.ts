/*
 * @Desc: 全屏是resize
 */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
export default (canvasEl: HTMLCanvasElement, width: number, height: number) => {
  const cursor = {
    x: 0,
    y: 0,
  };
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
   * 相机
   */

  const camera = new THREE.PerspectiveCamera(75, width / height, 1, 100);
  camera.position.z = 3;
  scene.add(camera);

  /**
   * 渲染器
   */
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasEl,
  });
  renderer.setSize(width, height);

  const controls = new OrbitControls(camera, canvasEl);
  //  controls.enabled=false
  controls.enableDamping = true;
  const clock = new THREE.Clock();
  const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  };
  tick();
};
