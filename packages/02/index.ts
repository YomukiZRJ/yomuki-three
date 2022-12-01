import useThree from './three'
const { addPointLight, removePointLight, addAmbientLight, removeAmbientLight, addDirectionalLight, removeDirectionalLight, addSpotLight, removeSpotLight, addHemisphereLight, removeHemisphereLight } = useThree()

document.querySelector('#PointLight')?.addEventListener('change', ({ srcElement }) => {
  const { checked = false }: {checked: Boolean} = srcElement
  checked ? addPointLight() : removePointLight()
})

document.querySelector('#AmbientLight')?.addEventListener('change', ({ srcElement }) => {
  const { checked = false }: {checked: Boolean} = srcElement
  checked ? addAmbientLight() : removeAmbientLight()
})

document.querySelector('#DirectionalLight')?.addEventListener('change', ({ srcElement }) => {
  const { checked = false }: {checked: Boolean} = srcElement
  checked ? addDirectionalLight() : removeDirectionalLight()
})

document.querySelector('#SpotLight')?.addEventListener('change', ({ srcElement }) => {
  const { checked = false }: {checked: Boolean} = srcElement
  checked ? addSpotLight() : removeSpotLight()
})

document.querySelector('#HemisphereLight')?.addEventListener('change', ({ srcElement }) => {
  const { checked = false }: {checked: Boolean} = srcElement
  checked ? addHemisphereLight() : removeHemisphereLight()
})
