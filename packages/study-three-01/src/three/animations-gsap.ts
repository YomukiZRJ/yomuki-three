/*
 * @Desc: 动画
 */
import * as THREE from "three";
import gsap from "gsap";
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

  gsap.to(group.position, { x: 2, duration: 1, delay: 1 });
  gsap.to(group.position, { x: 0, duration: 1, delay: 2 });

  const tick = () => {
    // 渲染
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  };
  tick();
};
