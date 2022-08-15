<template lang="pug">
#Edit
  .cabinets
    .cabinet(v-for="item in data[1].cabinets") 

  .threejs(ref="serverRef")
</template>
<script>
import { ref } from 'vue'
import data from '@mock/data'
import useScene from '@/hooks/useScene'
const planeWidth = 60 // 機房平面寬度
const planeLong = 60 // 機房平面長度

// 主機伺服器參數
const hostOption = {
  hostLimit: 60, // 一個機櫃中最多幾台主機
  hostWidth: 2, // 主機寬度
  hostLong: 2, // 主機長度
  hostHeight: 1, // 主機高度
}

const cameraPosition = [0, 40, 0] // 攝影機位置

export default {
  name: 'Edit',
  setup() {
    const serverRef = ref(null)
    const initFunc = () => {
      generateStructor()
    }

    const {
      createPlane,
      // createBlender
    } = useScene({
      elementRef: serverRef,
      initFunc,
      hostOption,
      cameraPosition,
      cameraMoveable: false,
    })

    const generateStructor = () => {
      const offsetCenter = (dataLength, parentPosi, i, width, interval) => {
        const middle = Math.ceil(dataLength / 2)
        let direction = middle > i ? -1 : 1
        let numb
        let posi
        if (dataLength % 2 === 1) {
          numb = i + 1 - middle
          posi = numb * (width + interval) + parentPosi
        } else {
          numb = i + 1 - middle
          if (numb > 0) {
            numb--
          }
          posi =
            numb * (width + interval) +
            ((width + interval) / 2) * direction +
            parentPosi
        }
        return posi
      }

      const house = data[1]
      const planePosiX = offsetCenter(1, 0, 0, planeWidth, 0.5)
      createPlane({
        houseName: house.houseName,
        url: house.url,
        width: planeWidth,
        long: planeLong,
        position: [planePosiX, 0, 0],
      })

      // house.cabinets.forEach((item) => {
      //   const cabinetPosiX =
      //     item.x + planePosiX - planeWidth / 2 + hostOption.hostWidth / 2
      //   const cabinetPosiZ = planeLong / 2 - item.z - hostOption.hostLong / 2

      //   createBlender({
      //     position: [cabinetPosiX, 0, cabinetPosiZ],
      //     modelUrl: item.url,
      //   })

      //   item.servers.forEach((item) => {
      //     createBlender({
      //       position: [cabinetPosiX, item.y, cabinetPosiZ],
      //       modelUrl: 'glTF/server.glb',
      //     })
      //   })
      // })
    }

    return {
      serverRef,
      data,
    }
  },
}
</script>
<style lang="sass" scoped>
#Edit
  display: flex
  +size(100vw,100vh)
  .cabinets
    width: 300px
  .threejs
    +size(calc(100% - 300px),100%)
    canvas
      +size(100%,100%)
</style>
