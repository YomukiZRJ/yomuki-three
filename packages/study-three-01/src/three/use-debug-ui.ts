/*
 * @Desc: debug ui
 * use dat.gui @see https://github.com/dataarts/dat.gui/blob/master/API.md
 */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import * as dat from "dat.gui";
export default (
  canvasEl: Ref<HTMLCanvasElement>,
  width: Ref<number>,
  height: Ref<number>
) => {
  /**
   * 创建gui对象
   */
  const gui = new dat.GUI({ closed: false });
  const geometryGui = gui.addFolder("geometry");
  const materialGui = gui.addFolder("material");
  /**
   * debug参数
   */
  const debugObject = {
    color: 0xff0000,
    spin: () => {
      gsap.to(group.rotation, { duration: 1, y: group.rotation.y + Math.PI });
    },
  };

  const aspect = computed(() => {
    return width.value / height.value;
  });
  const scene = new THREE.Scene();
  const group = new THREE.Group();
  scene.add(group);
  const material = new THREE.MeshBasicMaterial({ color: debugObject.color });
  const geometry = new THREE.BoxGeometry(1, 1, 1, 5, 5, 5);
  const cube1 = new THREE.Mesh(geometry, material);
  group.add(cube1);

  /**
   * gui debug
   * 第一个参数：某个对象
   * 第二个参数：对象的键名
   * 【第三个参数：最小值
   * 第四个参数：最大值
   * 第五个参数：精度】
   */
  geometryGui.add(group.position, "y", -3, 3, 0.01);
  geometryGui.add(group.position, "x", -3, 3, 0.01);
  geometryGui.add(group.position, "z").min(-3).max(3).step(0.01); // 也可以使用链式操作
  geometryGui.add(group, "visible").name("group 可见性"); // 布尔值
  materialGui.add(material, "wireframe").name("是否展示线框"); // 布尔值
  // 颜色
  materialGui.addColor(debugObject, "color").onChange((val) => {
    // 更新材质
    material.color.set(val);
  });
  geometryGui.add(debugObject, "spin"); // 一个按钮

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
    camera.aspect = aspect.value;
    camera.updateProjectionMatrix();
  };
  window.addEventListener("resize", handleResize);
};
