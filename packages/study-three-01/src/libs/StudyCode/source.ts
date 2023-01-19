import type { ISourcesItem } from './utils/Resources'
import { TypeEnum } from './utils/Resources'

const ASSET_DIR = '../assets/'

const sources: ISourcesItem[] = [
  {
    name: 'environmentMapTexture',
    type: TypeEnum.CubeTexture,
    path: [
        `${ASSET_DIR}environmentMaps/0/px.jpg`,
        `${ASSET_DIR}environmentMaps/0/nx.jpg`,
        `${ASSET_DIR}environmentMaps/0/py.jpg`,
        `${ASSET_DIR}environmentMaps/0/ny.jpg`,
        `${ASSET_DIR}environmentMaps/0/pz.jpg`,
        `${ASSET_DIR}environmentMaps/0/nz.jpg`
    ]
  },
  {
    name: 'foxModel',
    type: TypeEnum.GltfModel,
    path: [
        `${ASSET_DIR}models/Fox/glTF/Fox.gltf`
    ]
  },
  {
    name: 'floorColorTexture',
    type: TypeEnum.Texture,
    path: [
        `${ASSET_DIR}textures/dirt/color.jpg`
    ]
  },
  {
    name: 'floorNormalTexture',
    type: TypeEnum.Texture,
    path: [
        `${ASSET_DIR}textures/dirt/normal.jpg`
    ]
  }
]

export default sources
