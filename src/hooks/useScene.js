import { onMounted, onBeforeUnmount, onBeforeMount } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'

const cameraPosition = [0, 45, 45] // 攝影機位置

const blenderLoader = async (modelUrl) => {
  return new Promise((resolve) => {
    const loader = new GLTFLoader()
    loader.load(modelUrl, function (gltf) {
      resolve(gltf.scene)
    })
  })
}

function useScene(serverRef, initFunc, hostOption) {
  let camera, cameraControl, renderer, actives
  let targetTween, positionTween

  let target = { x: 0, y: 0, z: 0 }
  let position = {
    x: cameraPosition[0],
    y: cameraPosition[1],
    z: cameraPosition[2],
  }
  let targetStart = { x: 0, y: 0, z: 0 }
  let positionStart = {
    x: cameraPosition[0],
    y: cameraPosition[1],
    z: cameraPosition[2],
  }

  let scene = new THREE.Scene()
  const pointer = new THREE.Vector2()
  const raycaster = new THREE.Raycaster()

  const onPointerMove = (event) => {
    // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
  }

  const backStart = () => {
    target.x = 0
    target.y = 0
    target.z = 0
    position.x = cameraPosition[0]
    position.y = cameraPosition[1]
    position.z = cameraPosition[2]
    targetStart.x = cameraControl.target.x
    targetStart.y = cameraControl.target.y
    targetStart.z = cameraControl.target.z
    positionStart.x = cameraControl.object.position.x
    positionStart.y = cameraControl.object.position.y
    positionStart.z = cameraControl.object.position.z
    targetTween.start()
    positionTween.start()
  }

  const init = () => {
    scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x000000, 0.0008)

    // camera
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      500
    )

    camera.position.set(...cameraPosition)
    camera.lookAt(scene.position)

    // renderer
    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setClearColor(0x80adfc, 1.0)
    renderer.setClearColor(0x111111, 1.0)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = 2 // THREE.PCFSoftShadowMap

    cameraControl = new OrbitControls(camera, renderer.domElement)
    cameraControl.listenToKeyEvents(window)
    cameraControl.keyPanSpeed = 50

    // light
    let ambientLight = new THREE.AmbientLight(0xffffff)
    scene.add(ambientLight)
    let spotLight = new THREE.SpotLight(0xffffff)
    spotLight.position.set(0, 100, 100)
    spotLight.castShadow = true
    scene.add(spotLight)
    tweenHandler()

    initFunc()

    // 將渲染出來的畫面放到網頁上的 DOM
    serverRef.value.appendChild(renderer.domElement)
  }

  const tweenHandler = () => {
    const onUpdate = () => {
      cameraControl.target.set(targetStart.x, targetStart.y, targetStart.z)
    }

    const updatePostion = () => {
      cameraControl.object.position.set(
        positionStart.x,
        positionStart.y,
        positionStart.z
      )
    }

    targetTween = new TWEEN.Tween(targetStart)
      .to(target, 1000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(onUpdate)

    positionTween = new TWEEN.Tween(positionStart)
      .to(position, 1000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(updatePostion)
  }

  const pointerHover = () => {
    // 通过摄像机和鼠标位置更新射线
    raycaster.setFromCamera(pointer, camera)

    // 计算物体和射线的焦点
    const intersects = raycaster.intersectObjects(scene.children)
    if (intersects.length > 0) {
      if (actives !== intersects[0].object) {
        if (actives) {
          actives.children.forEach((child) => {
            if (child.material) {
              child.material.emissive.set(0x0)
            }
          })
        }
        if (intersects[0].object.parent.name === 'blender') {
          serverRef.value.classList.add('pointer')
          actives = intersects[0].object.parent
          actives.children.forEach((child) => {
            if (child.material) {
              child.material.emissive.set(0x424242)
            }
          })
        } else {
          serverRef.value.classList.remove('pointer')
          actives = null
        }
      }
    } else {
      if (actives) {
        actives.children.forEach((child) => {
          if (child.material) {
            child.material.emissive.set(0x0)
          }
        })
      }
      serverRef.value.classList.remove('pointer')
      actives = null
    }
  }

  const clickCabinet = () => {
    if (actives) {
      target.x = actives.position.x
      target.y = actives.position.y + hostOption.hostHeight * 2
      target.z = actives.position.z
      position.x = actives.position.x
      position.y = actives.position.y + hostOption.hostHeight * 2
      position.z = actives.position.z + hostOption.hostLong * 3
      targetStart.x = cameraControl.target.x
      targetStart.y = cameraControl.target.y
      targetStart.z = cameraControl.target.z
      positionStart.x = cameraControl.object.position.x
      positionStart.y = cameraControl.object.position.y
      positionStart.z = cameraControl.object.position.z
      targetTween.start()
      positionTween.start()
    }
  }

  const render = () => {
    cameraControl.update()
    pointerHover()
    TWEEN.update()
    requestAnimationFrame(render)
    renderer.render(scene, camera)
  }

  onBeforeMount(() => {})

  onMounted(() => {
    init()
    render()
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('click', clickCabinet)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('click', clickCabinet)
  })

  const createPlane = (row) => {
    const loader = new GLTFLoader()
    loader.load(row.url, function (gltf) {
      const x = row.position[0]
      const y = 0
      const z = row.position[2]
      gltf.scene.position.set(x, y, z)
      gltf.scene.name = 'floor'

      scene.add(gltf.scene)
    })
  }

  const createBlender = async ({ position, modelUrl }) => {
    const gltf = await blenderLoader(modelUrl)
    const x = position[0]
    const y = position[1]
    const z = position[2]
    gltf.position.set(x, y, z)
    gltf.name = 'blender'
    scene.add(gltf)
  }

  return {
    scene,
    createPlane,
    createBlender,
    backStart,
  }
}

export default useScene
