import * as THREE from 'three'
import { onMounted } from 'vue'

class Creeper {
  constructor() {
    // 宣告頭、身體、腳幾何體大小
    const headGeo = new THREE.BoxGeometry(4, 4, 4)
    const bodyGeo = new THREE.BoxGeometry(4, 8, 2)
    const footGeo = new THREE.BoxGeometry(2, 3, 2)

    // 苦力怕臉部貼圖
    const faceImg = require('@img/creeper_face.png')
    const headMap = new THREE.TextureLoader().load(faceImg)
    // 苦力怕皮膚貼圖
    const skinImg = require('@img/creeper_skin.png')
    const skinMap = new THREE.TextureLoader().load(skinImg)

    // 身體與腳的材質設定
    const skinMat = new THREE.MeshStandardMaterial({
      map: skinMap, // 皮膚貼圖
    })

    // 準備頭部與臉的材質
    const headMaterials = []
    for (let i = 0; i < 6; i++) {
      let map

      if (i === 1) map = headMap
      else map = skinMap

      headMaterials.push(new THREE.MeshStandardMaterial({ map: map }))
    }

    // 頭
    this.head = new THREE.Mesh(headGeo, headMaterials)

    this.head.position.set(0, 6, 0)

    // 身體
    this.body = new THREE.Mesh(bodyGeo, skinMat)
    this.body.position.set(0, 0, 0)

    // 四隻腳
    this.foot1 = new THREE.Mesh(footGeo, skinMat)
    this.foot1.position.set(-1, -5.5, 2)
    this.foot2 = this.foot1.clone() // 剩下三隻腳都複製第一隻的 Mesh
    this.foot2.position.set(-1, -5.5, -2)
    this.foot3 = this.foot1.clone()
    this.foot3.position.set(1, -5.5, 2)
    this.foot4 = this.foot1.clone()
    this.foot4.position.set(1, -5.5, -2)

    // 將四隻腳組合為一個 group
    this.feet = new THREE.Group()
    this.feet.add(this.foot1)
    this.feet.add(this.foot2)
    this.feet.add(this.foot3)
    this.feet.add(this.foot4)

    // 將頭、身體、腳組合為一個 group
    this.creeper = new THREE.Group()
    this.creeper.add(this.head)
    this.creeper.add(this.body)
    this.creeper.add(this.feet)
    this.creeper.name = 'creeper'
    // 苦力怕投影設定，利用 traverse 遍歷各個子元件設定陰影
    this.creeper.traverse(function (object) {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true
        object.receiveShadow = true
      }
    })
  }
}

function useCreeper(scene) {
  let scaleHeadOffset = 0
  let creeperObj = new Creeper()

  // 生成苦力怕並加到場景
  function createCreeper() {
    scene.add(creeperObj.creeper)
  }

  // 苦力怕膨脹
  function creeperScaleBody() {
    scaleHeadOffset += 0.04
    let scaleRate = Math.abs(Math.sin(scaleHeadOffset)) / 16 + 1
    creeperObj.creeper.scale.set(scaleRate, scaleRate, scaleRate)
  }

  onMounted(() => {
    createCreeper()
  })

  return {
    creeperObj,
    creeperScaleBody,
  }
}

export default useCreeper
