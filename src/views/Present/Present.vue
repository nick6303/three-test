<template lang="pug">
#Server
  //- router-link(to="/edit") 到編輯頁
  ThreeJs(
    ref="threeRef"
    :key="`${roomSelect}`"
    :currentRack="currentRack"
    :currentRoom="currentRoom"
  )
  .menu
    el-select(
      v-model="roomSelect"
      size="mini"
    )
      el-option(
        v-for="item in roomList"
        :value="item.id"
        :label="item.name"
      )
    el-button(
      size="mini"
      @click="backStart"
    ) 回到起始點
</template>
<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { ThreeJs } from './components'

export default {
  name: 'Present',
  components: {
    ThreeJs,
  },
  setup() {
    const store = useStore()
    const roomList = computed(() => store.state.roomList)
    const rackMountList = computed(() => store.state.rackMountList)

    const roomSelect = ref(roomList.value[0].id)
    const threeRef = ref(null)

    const currentRack = computed(() => {
      if (!roomSelect.value) {
        return []
      }

      return rackMountList.value.filter((item) => {
        return item.datacenter === roomSelect.value
      })
    })

    const currentRoom = computed(() => {
      if (!roomSelect.value) {
        return null
      }
      return roomList.value.find((item) => item.id === roomSelect.value)
    })

    const backStart = () => {
      threeRef.value.backStart()
    }

    return {
      roomSelect,
      roomList,
      currentRack,
      currentRoom,
      backStart,
      threeRef,
    }
  },
}
</script>

<style lang="sass" scoped>
#Server
  +size(100vw,100vh)
  position: relative
  a
    position: absolute
    top: 10px
    left: 10px
    color: #fff
  .menu
    position: absolute
    top: 10px
    right: 10px
    display: flex
    flex-direction: column
  .threejs
    +size(100%,100%)
    &.pointer
      cursor: pointer
</style>
