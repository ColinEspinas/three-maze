<script setup lang="ts">
import * as THREE from 'three'
import { useDeviceOrientation } from '@vueuse/core'
import { useDataPoint } from '../composables/useDataPoint'

const canvas = ref(null)
const { alpha, beta, gamma } = useDeviceOrientation()
const rotationAlpha = useDataPoint({ data: [0], range: 1 })
const rotationBeta = useDataPoint({ data: [0], range: 1 })
const rotationGamma = useDataPoint({ data: [0], range: 1 })

const degToRad = (deg: number) => deg * (Math.PI / 180)

async function setupScene() {
  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10)
  camera.position.z = 1

  const scene = new THREE.Scene()
  // const ammo = await Ammo.bind(window)()

  const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)
  const material = new THREE.MeshNormalMaterial()

  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: canvas.value || undefined,
  })

  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setAnimationLoop(() => render(
    camera, scene, mesh, renderer,
  ))
}

function render(
  camera: THREE.PerspectiveCamera,
  scene: THREE.Scene,
  mesh: THREE.Mesh,
  renderer: THREE.WebGLRenderer,
) {
  rotationAlpha.push(alpha.value ?? 0)
  rotationBeta.push(beta.value ?? 0)
  rotationGamma.push(gamma.value ?? 0)

  mesh.rotation.x = degToRad(rotationBeta.result.value ?? 0)
  mesh.rotation.y = degToRad(rotationGamma.result.value ?? 0)
  mesh.rotation.z = degToRad(rotationAlpha.result.value ?? 0)

  renderer.render(scene, camera)
}

onMounted(async () => {
  setupScene()
})
</script>

<template>
  <canvas id="three-scene" ref="canvas" class="absolute w-screen h-screen inset-0" />
  <div class="absolute left-0 top-0 p-4 text-white z-10">
    x: {{ Math.round(rotationBeta.result.value ?? 0) }}
    y: {{ Math.round(rotationGamma.result.value ?? 0) }}
    z: {{ Math.round(rotationAlpha.result.value ?? 0) }}
  </div>
</template>
