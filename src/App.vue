<script setup lang="ts">
import * as THREE from 'three'
import { useDeviceOrientation } from '@vueuse/core'

const canvas = ref(null)
const { beta, gamma } = useDeviceOrientation()

const degToRad = (deg: number) => deg * (Math.PI / 180)

onMounted(() => {
  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10)
  camera.position.z = 1

  const scene = new THREE.Scene()

  const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)
  const material = new THREE.MeshNormalMaterial()

  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: canvas.value || undefined,
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setAnimationLoop(animation)

  // animation
  function animation() {
    mesh.rotation.x = degToRad(beta.value ?? 0)
    mesh.rotation.y = degToRad(gamma.value ?? 0)

    renderer.render(scene, camera)
  }
})
</script>

<template>
  <canvas id="three-scene" ref="canvas" class="absolute w-screen h-screen inset-0" />
  <div class="absolute left-0 top-0 p-4 text-white z-10">
    x: {{ Math.round(beta ?? 0) }}
    y: {{ Math.round(gamma ?? 0) }}
  </div>
</template>
