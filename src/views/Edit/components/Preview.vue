<template lang="pug">
.Preview(ref="elementRef")
</template>
<script>
import { computed, ref } from 'vue'
import useScene from '@/hooks/useScene'
import { useStore } from 'vuex'

const planeWidth = 60 // 機房平面寬度
const planeLong = 60 // 機房平面長度

// // 主機伺服器參數
const hostOption = {
  hostLimit: 60, // 一個機櫃中最多幾台主機
  hostWidth: 2, // 主機寬度
  hostLong: 2, // 主機長度
  hostHeight: 1, // 主機高度
}

const cameraPosition = [0, 40, 0] // 攝影機位置
export default {
  name: 'Preview',
  props: {
    currentRoom: Object,
    rackData: Array,
  },
  setup(props, { emit }) {
    const store = useStore()
    const rackData = computed(() => (props ? props.rackData : []))
    const currentRoom = computed(() => (props ? props.currentRoom : {}))
    const rackList = computed(() => store.state.rackList)
    const elementRef = ref(null)
    const initFunc = () => {
      generateStructor()
    }

    const clickfunc = (val) => {
      emit('selectItem', val)
    }

    const { createPlane, createBlender } = useScene({
      elementRef: elementRef,
      initFunc,
      hostOption,
      cameraPosition,
      cameraMoveable: false,
      clickfunc,
      addGrid: true,
    })

    const generateStructor = () => {
      // const offsetCenter = (dataLength, parentPosi, i, width, interval) => {
      //   const middle = Math.ceil(dataLength / 2)
      //   let direction = middle > i ? -1 : 1
      //   let numb
      //   let posi
      //   if (dataLength % 2 === 1) {
      //     numb = i + 1 - middle
      //     posi = numb * (width + interval) + parentPosi
      //   } else {
      //     numb = i + 1 - middle
      //     if (numb > 0) {
      //       numb--
      //     }
      //     posi =
      //       numb * (width + interval) +
      //       ((width + interval) / 2) * direction +
      //       parentPosi
      //   }
      //   return posi
      // }

      // const planePosiX = offsetCenter(1, 0, 0, planeWidth, 0.5)
      createPlane({
        houseName: currentRoom.value.name,
        url: currentRoom.value.DataCenter_model,
        width: planeWidth,
        long: planeLong,
        position: [0, 0, 0],
      })

      rackData.value.forEach((item) => {
        const cabinetPosiX =
          item.rackmount_x + 0 - planeWidth / 2 + hostOption.hostWidth / 2
        const cabinetPosiZ =
          planeLong / 2 - item.rackmount_z - hostOption.hostLong / 2

        const rack = rackList.value.find((val) => val.id === item.rackmodel)

        createBlender({
          position: [cabinetPosiX, -5, cabinetPosiZ],
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
    return { elementRef }
  },
}
</script>
<style lang="sass" scoped>
.Preview
  +size(100vh,100%)
  &.pointer
    cursor: pointer
  canvas
    +size(100%,100%)
</style>
