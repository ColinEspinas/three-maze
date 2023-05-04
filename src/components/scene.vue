<script setup lang="ts">
import { useDeviceOrientation } from '@vueuse/core'
import { degToRad } from 'three/src/math/MathUtils.js'
import { useDataPoint } from '../composables/useDataPoint'
import { useThree } from '../composables/useThree'

const {
  createScene,
  createCamera,
  createModel,
  createDirectionalLight,
  setRender,
  canvas,
} = useThree()
// const { degToRad } = useMath()

// Device orientation data
const { alpha, beta, gamma } = useDeviceOrientation()
const rotationAlpha = useDataPoint({ data: [0], range: 1 })
const rotationBeta = useDataPoint({ data: [0], range: 1 })
const rotationGamma = useDataPoint({ data: [0], range: 1 })

// Three objects
const scene = createScene()
const camera = createCamera({})
// const cube = createCube(scene, 0.2, 0.2, 0.2)
createDirectionalLight(scene, 0xFFFFFF, 0.5)
const maze = await createModel(scene, 'maze.gltf', 0, 0, 0, 0.005)

// Three loop function
function animate() {
  rotationAlpha.push(alpha.value ?? 0)
  rotationBeta.push(beta.value ?? 0)
  rotationGamma.push(gamma.value ?? 0)

  maze.scene.rotation.x = degToRad(rotationBeta.result.value ?? 0)
  maze.scene.rotation.y = degToRad(rotationGamma.result.value ?? 0)
  maze.scene.rotation.z = degToRad(rotationAlpha.result.value ?? 0)

  // cube.mesh.rotation.x = degToRad(rotationBeta.result.value ?? 0)
  // cube.mesh.rotation.y = degToRad(rotationGamma.result.value ?? 0)
  // cube.mesh.rotation.z = degToRad(rotationAlpha.result.value ?? 0)
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
