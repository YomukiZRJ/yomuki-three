/*
 * @Desc: 几何
 */
import * as THREE from "three";
import { BufferAttribute } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
export default (
  canvasEl: Ref<HTMLCanvasElement>,
  width: Ref<number>,
  height: Ref<number>
) => {
  const aspect = computed(() => {
    return width.value / height.value;
  });
  const scene = new THREE.Scene();
  const group = new THREE.Group();
  scene.add(group);
  const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true, // 显示线框（不要用它来创建某个类似于框体的对象，因为在不同计算机上 它的呈现出来的粗细可能会不同）
    })
  );
  // group.add(cube1);
  /**
   * 自定义几何体
   */
  const createVertices = (count: number) => {
    const positions: [number] = [];
    const colors: [number] = [];
    for (let index = 0; index < count; index++) {
      for (let j = 0; j < 3; j++) {
        positions.push(
          (Math.random() - 0.5) * 3, // Math.random() - 0.5 在-0.5 ~ 0。5之间
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 3
        );
        colors.push(Math.random(), Math.random(), Math.random());
      }
    }
    return {
      positions,
      colors,
    };
  };
  const { positions, colors } = createVertices(50);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(positions), 3)
  ); // 一个顶点三个向量为一组
  geometry.setAttribute(
    "color",
    new BufferAttribute(new Float32Array(colors), 3)
  );
  const cube2 = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({
      vertexColors: true,
      // color: 0x00ff00,
      wireframe: true,
    })
  );
  group.add(cube2);
  const camera = new THREE.PerspectiveCamera(75, aspect.value, 0.1, 100);
  camera.position.z = 3;
  scene.add(camera);
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasEl,
  });
  renderer.setSize(width.value, height.value);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 设置像素比
  const controls = new OrbitControls(camera, canvasEl);
  controls.enableDamping = true;
  const tick = () => {
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  };
  tick();
  const handleResize = () => {
    renderer.setSize(width.value, height.value);
    camera.aspect = aspect.value; // 重新赋值照相机的aspect
    camera.updateProjectionMatrix(); // 更新投影矩阵
  };
  watchDebounced(width, handleResize, { debounce: 500 });
  watchDebounced(height, handleResize, { debounce: 500 });
};
