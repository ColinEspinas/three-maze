<script setup lang="ts">
import { useDeviceMotion, useDeviceOrientation } from '@vueuse/core'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { useDataPoint } from '../composables/useDataPoint'
import { useThree } from '../composables/useThree'
import { useMath } from '../composables/useMath'

const {
  createScene,
  createCamera,
  createModel,
  createDirectionalLight,
  createAmbiantLight,
  setRender,
  canvas,
} = useThree()

const { degToRad } = useMath()

// Device orientation data
const { alpha, beta, gamma } = useDeviceOrientation()
const rotationAlpha = useDataPoint({ data: [0], range: 1 })
const rotationBeta = useDataPoint({ data: [0], range: 1 })
const rotationGamma = useDataPoint({ data: [0], range: 1 })

// Device motion data
const {
  acceleration,
} = useDeviceMotion()
const derivateDataPoint = useDataPoint({ data: [0], range: 1000 })
const norm = computed(() => {
  if (
    acceleration.value !== null
    && acceleration.value.x !== null
    && acceleration.value?.y !== null
    && acceleration.value?.z !== null
  ) {
    return (
      acceleration.value.x ** 2
      + acceleration.value.y ** 2
      + acceleration.value.z ** 2
    ) ** 2
  }
  return 0
})
const oldNorm = ref(0)
const derivate = ref(0)

const clock = new THREE.Clock()

// Three objects
const scene = createScene()
const camera = createCamera({})
createDirectionalLight(scene, 0xFFFFFF, 1)
createAmbiantLight(scene, 0xFFFFFF, 1)
const roundMaze = await createModel(scene, 'maze.gltf', 0, 0, 0, 0.005)
const squareMaze = await createModel(scene, 'ballmazefirst.gltf', 0, 0, 0, 0.007)
let squareIsDisplayed = false
let switchCooldown = 0
let controls: OrbitControls

// Three loop function
function animate() {
  if (norm.value !== null && typeof norm.value !== 'undefined') {
    derivate.value = Math.abs(norm.value - oldNorm.value) / ((clock.getDelta() || 0.001) * 1000)
    oldNorm.value = norm.value
    derivateDataPoint.push(derivate.value)
  }

  if (derivate.value > 200000 && switchCooldown > 60) {
    squareIsDisplayed = !squareIsDisplayed
    switchCooldown = 0
  }
  if (switchCooldown < 80)
    switchCooldown += 1

  rotationAlpha.push(alpha.value ?? 0)
  rotationBeta.push(beta.value ?? 0)
  rotationGamma.push(gamma.value ?? 0)

  if (!squareIsDisplayed) {
    // Set visibility of the maze
    roundMaze.scene.visible = true
    squareMaze.scene.visible = false

    roundMaze.scene.rotation.x = degToRad(rotationBeta.result.value ?? 0)
    roundMaze.scene.rotation.y = degToRad(rotationGamma.result.value ?? 0)
    roundMaze.scene.rotation.z = degToRad(rotationAlpha.result.value ?? 0)
  }
  else {
    // Set visibility of the maze
    roundMaze.scene.visible = false
    squareMaze.scene.visible = true

    squareMaze.scene.rotation.x = degToRad(rotationBeta.result.value ?? 0)
    squareMaze.scene.rotation.y = degToRad(rotationGamma.result.value ?? 0)
    squareMaze.scene.rotation.z = degToRad(rotationAlpha.result.value ?? 0)
  }
  if (controls)
    controls.update()
}

onMounted(() => {
  controls = new OrbitControls(camera, canvas.value)
  controls.enableDamping = true
  controls.screenSpacePanning = false
  controls.target.set(0, 0, 0)
})

setRender(scene, camera, animate)
</script>

<template>
  <canvas id="three-scene" ref="canvas" class="absolute w-screen h-screen inset-0" />
  <div class="absolute left-0 top-0 p-4 text-white z-10">
    x: {{ Math.round(rotationBeta.result.value ?? 0) }}
    y: {{ Math.round(rotationGamma.result.value ?? 0) }}
    z: {{ Math.round(rotationAlpha.result.value ?? 0) }}
    derivate: {{ Math.round(derivateDataPoint.result.value ?? 0) }}
    max: {{ derivateDataPoint.max }}
    min: {{ derivateDataPoint.min }}
  </div>
</template>
