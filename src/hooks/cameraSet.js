import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

function cameraSet(camera) {
  let renderer, cameraControl
  // 渲染器設定
  renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true // 設定需渲染陰影效果
  renderer.shadowMap.type = 2 // THREE.PCFSoftShadowMap

  // 建立 OrbitControls
  cameraControl = new OrbitControls(camera, renderer.domElement)
  cameraControl.enableDamping = true // 啟用阻尼效果
  cameraControl.dampingFactor = 0.25 // 阻尼系數

  return {
    renderer,
    cameraControl,
  }
}

export default cameraSet
