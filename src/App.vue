<script setup lang="ts">
import * as THREE from 'three'
import { useDeviceOrientation } from '@vueuse/core'

const canvas = ref(null)
const { alpha, beta } = useDeviceOrientation()

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
    mesh.rotation.x = beta.value ?? 0
    mesh.rotation.y = alpha.value ?? 0

    renderer.render(scene, camera)
  }
})
</script>

<template>
  <canvas id="three-scene" ref="canvas" />
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}

#three-scene {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}
</style>
