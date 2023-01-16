import type { GUI } from 'lil-gui'
import * as THREE from 'three'
export const createObject3DGui = (gui: GUI, obj: THREE.Group, name = 'object3d') => {
  const folder = gui.addFolder(name)
  folder.close()
  folder.add(obj, 'visible')
  folder.add(obj.position, 'x').min(-5)
    .max(5)
    .step(0.001)
  folder.add(obj.position, 'y').min(-5)
    .max(5)
    .step(0.001)
  folder.add(obj.position, 'z').min(-5)
    .max(5)
    .step(0.001)
  folder.add(obj.scale, 'x').min(0)
    .max(5)
    .step(0.001)
  folder.add(obj.scale, 'y').min(0)
    .max(5)
    .step(0.001)
  folder.add(obj.scale, 'z').min(0)
    .max(5)
    .step(0.001)
}
export const createFogGui = (gui: GUI, obj: THREE.Fog) => {
  const folder = gui.addFolder('雾')
  folder.close()
  folder.add(obj, 'near')
  folder.add(obj, 'far')
}
/**
 * 创建环境光调试面板
 * @param gui
 * @param light
 */
export const createAmbientLightGui = (gui: GUI, light: THREE.AmbientLight) => {
  const folder = gui.addFolder('环境光')
  folder.close()
  folder.add(light, 'intensity').min(0)
    .max(1)
    .step(0.001)
}

/**
 * 创建平行光调试面板
 * @param gui
 * @param light
 */
export const createDirectionalLightGui = (gui: GUI, light: THREE.DirectionalLight) => {
  const folder = gui.addFolder('平行光')
  folder.close()
  folder.add(light, 'visible')
  folder.add(light, 'intensity').min(0)
    .max(20)
    .step(0.001)
  folder.add(light.position, 'x').min(-5)
    .max(5)
    .step(0.001)
  folder.add(light.position, 'y').min(-5)
    .max(5)
    .step(0.001)
  folder.add(light.position, 'z').min(-5)
    .max(5)
    .step(0.001)

  createDirectionalLightShadow(folder, light)
}
const createDirectionalLightShadow = (gui: GUI, light: THREE.DirectionalLight) => {
  const folder = gui.addFolder('阴影')
  folder.close()
  folder.add(light, 'castShadow')
  folder.add(light.shadow, 'radius')
  //   folder.add(light.shadow.mapSize, 'width', [512 * 1, 512 * 2, 512 * 3, 512 * 4]).onChange((val) => {
  //     light.update()
  //   })
  //   folder.add(light.shadow.mapSize, 'height', [512 * 1, 512 * 2, 512 * 3, 512 * 4]).onChange(() => {
  //     light.update()
  //   })
  createOrthographicCameraGui(gui, light.shadow.camera)
}
/**
 * 创建正交相机调试面板
 * @param gui
 * @param obj
 */
export const createOrthographicCameraGui = (gui, obj: THREE.OrthographicCamera) => {
  const folder = gui.addFolder('正交相机')
  folder.close()
  folder.add(obj, 'near').min(0.1)
    .onChange(() => {
      obj.updateProjectionMatrix()
    })
  folder.add(obj, 'far').min(0.1)
    .onChange(() => {
      obj.updateProjectionMatrix()
    })
  folder.add(obj, 'far').min(0.1)
    .onChange(() => {
      obj.updateProjectionMatrix()
    })
  folder.add(obj, 'top').min(0.1)
    .onChange(() => {
      obj.updateProjectionMatrix()
    })
  folder.add(obj, 'right').min(0.1)
    .onChange(() => {
      obj.updateProjectionMatrix()
    })
  folder.add(obj, 'bottom').min(0.1)
    .onChange(() => {
      obj.updateProjectionMatrix()
    })
  folder.add(obj, 'left').min(0.1)
    .onChange(() => {
      obj.updateProjectionMatrix()
    })
}
/**
 * 创建正交相机调试面板
 * @param gui
 * @param obj
 */
export const createPerspectiveCameraGui = (gui, obj: THREE.PerspectiveCamera) => {
  const folder = gui.addFolder('透视相机')
  folder.close()
  folder.add(obj, 'fov').min(0.1)
    .max(100)
    .step(0.1)
    .onChange(() => {
      obj.updateProjectionMatrix()
    })
  folder.add(obj, 'near').min(0.1)
    .onChange(() => {
      obj.updateProjectionMatrix()
    })
  folder.add(obj, 'far').min(0.1)
    .onChange(() => {
      obj.updateProjectionMatrix()
    })
}
/**
 * 创建标准材质调试面板
 * @param gui
 * @param obj
 */
export const createMeshStandardMaterialGui = (gui, obj: THREE.MeshStandardMaterial) => {
  const folder = gui.addFolder('标准材质')
  folder.close()
  folder.add(obj, 'metalness').min(0)
    .max(1)
    .step(0.001)
  folder.add(obj, 'roughness').min(0)
    .max(1)
    .step(0.001)
}

export const createRendererGui = (gui: GUI, obj: THREE.WebGLRenderer) => {
  const folder = gui.addFolder('渲染器')
  folder.close()
  folder.add(obj.shadowMap, 'enabled').name('是否渲染阴影')
  folder.add(obj.shadowMap, 'type', [THREE.BasicShadowMap, THREE.PCFShadowMap]).name('阴影贴图计算方式')
    .onChange(() => {
      obj.shadowMap.needsUpdate = true
    })
}

export const createSpotLightGui = (gui: GUI, light: THREE.SpotLight) => {
  const folder = gui.addFolder('聚光灯')
  folder.close()
  folder.add(light, 'visible')
  folder.add(light, 'intensity').min(0)
    .max(1)
    .step(0.001)
  folder.add(light.position, 'x').min(-5)
    .max(5)
    .step(0.001)
  folder.add(light.position, 'y').min(-5)
    .max(5)
    .step(0.001)
  folder.add(light.position, 'z').min(-5)
    .max(5)
    .step(0.001)
  folder.add(light, 'castShadow')
  createPerspectiveCameraGui(folder, light.shadow.camera)
}

export const createPointsMaterialGui = (gui: GUI, obj: THREE.PointsMaterial) => {
  const folder = gui.addFolder('点材质')
  const params = {
    color: `#${obj.color.getHexString()}`
  }
  folder.close()
  folder.addColor(params, 'color').onChange((val) => {
    obj.color.set(val)
  })
  folder.add(obj, 'vertexColors').onChange(() => {
    obj.needsUpdate = true
  })
  folder.add(obj, 'size').min(0)
    .max(0.5)
    .step(0.001)
  folder.add(obj, 'sizeAttenuation').onChange(() => {
    obj.needsUpdate = true
  })
  folder.add(obj, 'alphaTest').min(0)
    .max(1)
    .step(0.001)
  folder.add(obj, 'depthTest')
  folder.add(obj, 'depthWrite')
}
