import { onMounted, onBeforeUnmount, onBeforeMount } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'
import { text } from '@/utils'

const blenderLoader = async (modelUrl) => {
  return new Promise((resolve) => {
    const loader = new GLTFLoader()
    loader.load(modelUrl, function (gltf) {
      resolve(gltf.scene)
    })
  })
}

function useScene({
  elementRef,
  initFunc,
  hostOption,
  cameraPosition,
  cameraMoveable = true,
  clickfunc,
  addGrid = false,
}) {
  let cameraControl, camera, renderer, actives
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
    pointer.x = (event.offsetX / elementRef.value.offsetWidth) * 2 - 1
    pointer.y = -(event.offsetY / elementRef.value.offsetHeight) * 2 + 1
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
    targetTween.start()
    positionTween.start()
  }

  const init = () => {
    scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x000000, 0.0008)

    // camera
    camera = new THREE.PerspectiveCamera(
      75,
      elementRef.value.offsetWidth / elementRef.value.offsetHeight,
      1,
      500
    )

    camera.position.set(...cameraPosition)
    camera.lookAt(scene.position)

    // renderer
    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setClearColor(0x80adfc, 1.0)
    renderer.setClearColor(0x111111, 1.0)
    renderer.setSize(
      elementRef.value.offsetWidth,
      elementRef.value.offsetHeight
    )
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = 2 // THREE.PCFSoftShadowMap

    if (cameraMoveable) {
      cameraControl = new OrbitControls(camera, renderer.domElement)
      cameraControl.listenToKeyEvents(window)
      cameraControl.keyPanSpeed = 50
      tweenHandler()
    }

    // light
    let ambientLight = new THREE.AmbientLight(0xffffff)
    scene.add(ambientLight)
    let spotLight = new THREE.SpotLight(0xffffff)
    spotLight.position.set(0, 100, 100)
    spotLight.castShadow = true
    scene.add(spotLight)

    if (addGrid) {
      // 加入格線
      const gridHelper = new THREE.GridHelper(120, 120, 0x0000ff, 0x808080)
      gridHelper.position.x = 0
      gridHelper.position.y = 0.1
      gridHelper.position.z = 0
      scene.add(gridHelper)
    }

    initFunc()

    // 將渲染出來的畫面放到網頁上的 DOM
    elementRef.value.appendChild(renderer.domElement)
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
        if (intersects[0].object.parent.type === 'blender') {
          elementRef.value.classList.add('pointer')
          actives = intersects[0].object.parent
          actives.children.forEach((child) => {
            if (child.material) {
              child.material.emissive.set(0x424242)
            }
          })
        } else {
          if (elementRef.value) {
            elementRef.value.classList.remove('pointer')
          }
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
      if (elementRef.value) {
        elementRef.value.classList.remove('pointer')
      }
      actives = null
    }
  }

  const clickCabinet = () => {
    if (actives) {
      if (cameraMoveable) {
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
      if (clickfunc) {
        clickfunc(actives)
      }
    }
  }

  const render = () => {
    if (cameraMoveable) {
      cameraControl.update()
    }
    pointerHover()
    TWEEN.update()
    requestAnimationFrame(render)
    renderer.render(scene, camera)
  }

  onBeforeMount(() => {})

  onMounted(() => {
    init()
    render()
    elementRef.value.addEventListener('pointermove', onPointerMove)
    elementRef.value.addEventListener('click', clickCabinet)
  })

  onBeforeUnmount(() => {
    elementRef.value.removeEventListener('pointermove', onPointerMove)
    elementRef.value.removeEventListener('click', clickCabinet)
  })

  const createPlane = (row) => {
    const x = row.position[0]
    const y = 0
    const z = row.position[2]

    const loader = new GLTFLoader()
    loader.load(row.url, function (gltf) {
      gltf.scene.position.set(x, y, z)
      gltf.scene.type = 'floor'
      scene.add(gltf.scene)
    })
  }

  const createBlender = async ({ position, modelUrl, name }) => {
    const gltf = await blenderLoader(modelUrl)
    const x = position[0]
    const y = position[1]
    const z = position[2]
    gltf.position.set(x, y, z)
    gltf.type = 'blender'
    if (name) {
      gltf.name = name
    }
    scene.add(gltf)
  }

  const createText = (message, position) => {
    const word = new text(message, position)
    scene.add(word.text)
  }

  return {
    scene,
    createPlane,
    createBlender,
    backStart,
    createText,
  }
}

export default useScene
