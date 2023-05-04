import * as THREE from 'three'
import type { GLTF } from 'three/addons/loaders/GLTFLoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

export function useThree() {
  const canvas = ref()
  let renderer: THREE.WebGLRenderer | undefined
  const render = ref(() => {})
  const loader = new GLTFLoader()

  const setRender = (scene: THREE.Scene, camera: THREE.PerspectiveCamera, animate: () => void) => {
    render.value = () => {
      if (!renderer)
        throw new Error('Renderer is not defined')
      animate()
      renderer.render(scene, camera)
    }
  }

  const createCamera = (options: {
    fov?: number
    aspect?: number
    near?: number
    far?: number
    position?: THREE.Vector3
  }) => {
    const camera = new THREE.PerspectiveCamera(
      options.fov || 70,
      options.aspect || window.innerWidth / window.innerHeight,
      options.near || 0.01,
      options.far || 10,
    )
    camera.position.z = 1
    return camera
  }

  const createScene = () => {
    const scene = new THREE.Scene()
    return scene
  }

  const createCube = (scene: THREE.Scene, x: number, y: number, z: number) => {
    const geometry = new THREE.BoxGeometry(x, y, z)
    const material = new THREE.MeshNormalMaterial()

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    return {
      geometry,
      material,
      mesh,
    }
  }

  const createModel = async (scene: THREE.Scene, file: string, x: number, y: number, z: number, scale: number): Promise<GLTF> => {
    return new Promise((resolve, reject) => {
      loader.load(
        // resource URL
        file,
        // called when the resource is loaded
        (gltf) => {
          gltf.scene.position.set(x, y, z)
          gltf.scene.scale.set(scale, scale, scale)
          scene.add(gltf.scene)
          resolve(gltf)
        },
        // called while loading is progressing
        (xhr) => {
          console.info(`${xhr.loaded / xhr.total * 100}% loaded`)
        },
        // called when loading has errors
        (error) => {
          reject(error)
        },
      )
    })
  }

  const createDirectionalLight = (scene: THREE.Scene, color: number, intensity: number) => {
    const directionalLight = new THREE.DirectionalLight(color, intensity)
    directionalLight.position.set(1, 7, 2)
    scene.add(directionalLight)
  }

  onMounted(() => {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvas.value,
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setAnimationLoop(() => render.value())
  })

  return {
    canvas,
    render,
    setRender,
    createCamera,
    createScene,
    createCube,
    createModel,
    createDirectionalLight,
  }
}
