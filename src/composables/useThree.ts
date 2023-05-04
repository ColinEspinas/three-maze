import * as THREE from 'three'

export function useThree() {
  const canvas = ref()
  const meshes: THREE.Mesh[] = []
  let renderer: THREE.WebGLRenderer | undefined
  const render = ref(() => {})

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
    meshes.push(mesh)
    scene.add(...meshes)

    return {
      geometry,
      material,
      mesh,
    }
  }

  onMounted(() => {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvas.value,
    })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setAnimationLoop(() => render.value())
    // document.body.appendChild(renderer.domElement)
  })

  return {
    render,
    meshes,
    setRender,
    createCamera,
    createScene,
    createCube,
    canvas,
  }
}
