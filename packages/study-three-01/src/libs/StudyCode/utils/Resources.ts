import { CubeTextureLoader, LoadingManager, TextureLoader } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { resourcesSuccessKey } from './event-bus-key'
const { emit } = useEventBus(resourcesSuccessKey)
export enum TypeEnum {
  CubeTexture,
  GltfModel,
  Texture,
}
export interface ISourcesItem {
  name: string
  type: TypeEnum
  path: string[]
}
export default class Resources{
  sources
  /**
   * 已经载入的资源
   */
  items: Map<string, any>
  /**
   * 需要载入的数量
   */
  toLoad
  /**
   * 已载入的数量
   */
  loaded
  /**
   * 管理工具
   */
  loadingManager
  /**
   * 载入器
   */
  loaders: {
    gltfLoader: gltfLoader
    textureLoader: TextureLoader
    cubeTextureLoader: CubeTextureLoader
  }

  constructor (sources: ISourcesItem[]) {
    this.sources = sources
    this.items = new Map()
    this.toLoad = this.sources.length
    this.loaded = 0

    this.#setLoadingManager()
    this.#setLoaders()
    this.#startLoading()
  }

  /**
   * 设置加载管理
   */
  #setLoadingManager () {
    this.loadingManager = new LoadingManager()
    this.loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
      console.log(`Started loading file: ${url}.\nLoaded ${itemsLoaded} of ${itemsTotal} files.`)
    }
    this.loadingManager.onLoad = () => {
      console.log('Loading complete!')
      emit('loaded')
    }
    this.loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      console.log(`Loading file: ${url}.\nLoaded ${itemsLoaded} of ${itemsTotal} files.`)
    }
    this.loadingManager.onError = (url) => {
      console.log(`There was an error loading ${url}`)
    }
  }

  /**
   * 设置载入器
   */
  #setLoaders () {
    this.loaders = {
      gltfLoader: new GLTFLoader(this.loadingManager),
      textureLoader: new TextureLoader(this.loadingManager),
      cubeTextureLoader: new CubeTextureLoader(this.loadingManager)
    }
  }

  /**
   * 开始载入
   */
  #startLoading () {
    this.sources.forEach(({ name, path, type }) => {
      if (path.length > 0){
        switch (type){
          case TypeEnum.CubeTexture:
            this.#loadCubeTexture(name, path)
            break

          case TypeEnum.GltfModel:
            this.#loadGltfModel(name, path)
            break
          case TypeEnum.Texture:
            this.#loadTexture(name, path)
            break
        }
      }
    })
  }

  /**
   * 载入模型
   */
  #loadGltfModel (name: string, path: string[]) {
    this.loaders.gltfLoader.load(path[0], (gltf) => {
      this.#pushItem(name, gltf)
    })
  }

  /**
   * 载入纹理
   */
  #loadTexture (name: string, path: string[]) {
    this.#pushItem(name, this.loaders.textureLoader.load(path[0]))
  }

  /**
   * 载入立方体纹理
   */
  #loadCubeTexture (name: string, path: string[]) {
    this.#pushItem(name, this.loaders.cubeTextureLoader.load(path))
  }

  /**
   * 推入数据
   */
  #pushItem (name: String, data: any) {
    this.loaded++
    this.items.set(name, data)
  }
}
