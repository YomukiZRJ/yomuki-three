/*
 * @Desc: 全屏是resize
 */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
export default (
  canvasEl: Ref<HTMLCanvasElement>,
  width: Ref<number>,
  height: Ref<number>
) => {
  const { toggle: toggleFullscreen } = useFullscreen();
  const aspect = computed(() => {
    return width.value / height.value;
  });
  const scene = new THREE.Scene();
  const group = new THREE.Group();
  scene.add(group);
  const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  );
  group.add(cube1);
  const camera = new THREE.PerspectiveCamera(75, aspect.value, 0.1, 100);
  camera.position.z = 3;
  scene.add(camera);
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasEl,
  });
  renderer.setSize(width.value, height.value);
  // window.devicePixelRatio 当前设备的窗口像素比
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 设置像素比

  const controls = new OrbitControls(camera, canvasEl);
  controls.enableDamping = true;

  const tick = () => {
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  };
  tick();
  /**
   * 处理窗口大小变更
   */
  const handleResize = () => {
    renderer.setSize(width.value, height.value);
    camera.aspect = aspect.value; // 重新赋值照相机的aspect
    camera.updateProjectionMatrix(); // 更新投影矩阵
  };
  watchDebounced(width, handleResize, { debounce: 500 });
  watchDebounced(height, handleResize, { debounce: 500 });

  /**
   * 老铁双击进入全屏
   */
  const toFullscreen = () => {
    toggleFullscreen()
  };
  window.addEventListener("dblclick", toFullscreen);
};
