<template lang="pug">
.threejs(
  ref="serverRef"
)
</template>
<script>
import useScene from '@/hooks/useScene'
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

const planeWidth = 60 // 機房平面寬度
const planeLong = 60 // 機房平面長度

// 主機伺服器參數
const hostOption = {
  hostLimit: 60, // 一個機櫃中最多幾台主機
  hostWidth: 2, // 主機寬度
  hostLong: 2, // 主機長度
  hostHeight: 1, // 主機高度
}

const cameraPosition = [0, 45, 45] // 攝影機位置

export default {
  name: 'ThreeJs',
  props: {
    currentRack: Array,
    currentRoom: Object,
  },
  setup(props) {
    const store = useStore()
    const rackList = computed(() => store.state.rackList)
    const currentRack = computed(() => (props ? props.currentRack : []))
    const currentRoom = computed(() => (props ? props.currentRoom : {}))

    const serverRef = ref(null)

    const initFunc = () => {
      generateStructor()
    }
    const { createPlane, createBlender, backStart } = useScene({
      elementRef: serverRef,
      initFunc,
      hostOption,
      cameraPosition,
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

      const planePosiX = offsetCenter(1, 0, 0, planeWidth, 0.5)
      createPlane({
        houseName: currentRoom.value.name,
        url: currentRoom.value.DataCenter_model,
        width: planeWidth,
        long: planeLong,
        position: [planePosiX, 0, 0],
      })

      currentRack.value.forEach((item) => {
        const cabinetPosiX =
          item.rackmount_x +
          planePosiX -
          planeWidth / 2 +
          hostOption.hostWidth / 2
        const cabinetPosiZ =
          planeLong / 2 - item.rackmount_z - hostOption.hostLong / 2

        const rack = rackList.value.find((val) => val.id === item.rackmodel)

        createBlender({
          position: [cabinetPosiX, 0, cabinetPosiZ],
          modelUrl: rack.rackmount_model,
          name: item.id,
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
      backStart,
      serverRef,
    }
  },
}
</script>
