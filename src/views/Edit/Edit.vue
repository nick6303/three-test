<template lang="pug">
#Edit
  .cabinets
    router-link(to="/") 回到預覽
    el-table(:data="data[0].cabinets" border)
      el-table-column(prop="cabinetName" label="機櫃名稱")
      el-table-column(prop="x" label="X座標")
      el-table-column(prop="z" label="Z座標")
      el-table-column(label="功能")
        template(#default="scope")
          el-button(
            @click="handleClick(scope.row)" 
            type="text" 
            size="small"
          ) 編輯
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

    const { createPlane, createBlender } = useScene({
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

      const house = data[0]
      const planePosiX = offsetCenter(1, 0, 0, planeWidth, 0.5)
      createPlane({
        houseName: house.houseName,
        url: house.url,
        width: planeWidth,
        long: planeLong,
        position: [planePosiX, 0, 0],
      })

      house.cabinets.forEach((item) => {
        const cabinetPosiX =
          item.x + planePosiX - planeWidth / 2 + hostOption.hostWidth / 2
        const cabinetPosiZ = planeLong / 2 - item.z - hostOption.hostLong / 2

        createBlender({
          position: [cabinetPosiX, -5, cabinetPosiZ],
          modelUrl: item.url,
        })

        // item.servers.forEach((item) => {
        //   createBlender({
        //     position: [cabinetPosiX, item.y, cabinetPosiZ],
        //     modelUrl: 'glTF/server.glb',
        //   })
        // })
      })
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
    width: calc(100% - 100vh)
    height: 100vh
    padding: 30px 5px 0
    position: relative
    a
      position: absolute
      top: 0
      left: 5px
      display: block
    :deep(.el-table)
      +size(100%,calc(100% - 90px))
  .threejs
    +size(100vh,100%)
    canvas
      +size(100%,100%)
</style>
