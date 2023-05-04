<script setup lang="ts">
import { useDeviceOrientation } from '@vueuse/core'
import { useDataPoint } from '../composables/useDataPoint'
import { useThree } from '../composables/useThree'

const { alpha, beta, gamma } = useDeviceOrientation()
const rotationAlpha = useDataPoint({ data: [0], range: 1 })
const rotationBeta = useDataPoint({ data: [0], range: 1 })
const rotationGamma = useDataPoint({ data: [0], range: 1 })

const degToRad = (deg: number) => deg * (Math.PI / 180)

// async function setupPhysics(scene: THREE.Scene, meshes: THREE.Mesh[]) {
//   const ammo = await Ammo.bind(window)()
// }

const { createScene, createCamera, createCube, setRender, canvas } = useThree()

const scene = createScene()
const camera = createCamera({})
const cube = createCube(scene, 0.2, 0.2, 0.2)

function animate() {
  rotationAlpha.push(alpha.value ?? 0)
  rotationBeta.push(beta.value ?? 0)
  rotationGamma.push(gamma.value ?? 0)

  cube.mesh.rotation.x = degToRad(rotationBeta.result.value ?? 0)
  cube.mesh.rotation.y = degToRad(rotationGamma.result.value ?? 0)
  cube.mesh.rotation.z = degToRad(rotationAlpha.result.value ?? 0)
}

setRender(scene, camera, animate)
</script>

<template>
  <canvas id="three-scene" ref="canvas" class="absolute w-screen h-screen inset-0" />
  <div class="absolute left-0 top-0 p-4 text-white z-10">
    x: {{ Math.round(rotationBeta.result.value ?? 0) }}
    y: {{ Math.round(rotationGamma.result.value ?? 0) }}
    z: {{ Math.round(rotationAlpha.result.value ?? 0) }}
  </div>
</template>
