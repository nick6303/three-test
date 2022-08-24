<template lang="pug">
#Edit
  .cabinets
    //- router-link(to="/") 回到預覽
    .top
      .row
        p 機房
        el-select(v-model="roomSelect")
          el-option(
            v-for="item in roomList"
            :value="item.id"
            :label="item.name"
          )
      AddRackMount(
        :roomSelect="roomSelect"
        :rackList="rackList"
        @getRackMount="getRackMount"
      )
    Table(
      ref="tableRef"
      :currentRack="currentRack"
      :loading="loading"
      :rackList="rackList"
      :key="`${roomSelect}${timeStamp}`"
      @getRackMount="getRackMount"
    )
  Preview(
    v-if="currentRoom && currentRack.length !== 0"
    :key="`${roomSelect}${timeStamp}`"
    :currentRoom="currentRoom"
    :rackData="currentRack"
    :rackList="rackList"
    @selectItem="selectItem"
  )
</template>
<script>
import { computed, onMounted, ref } from 'vue'

import { Preview, Table, AddRackMount } from './components'
import { useStore } from 'vuex'

export default {
  name: 'Edit',
  components: {
    Preview,
    Table,
    AddRackMount,
  },
  setup() {
    const store = useStore()
    const roomList = computed(() => store.state.roomList)
    const rackList = computed(() => store.state.rackList)
    const rackMountList = computed(() => store.state.rackMountList)

    const tableRef = ref(null)
    const timeStamp = ref('')

    const roomSelect = ref(undefined)
    const formOpen = ref(false)
    const loading = ref(false)

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

    const selectItem = (val) => {
      const index = currentRack.value.findIndex((item) => item.id === val.name)
      tableRef.value.setCurrent(index)
    }

    const getRackMount = async () => {
      loading.value = true
      try {
        await store.dispatch('setRackMountList')
        timeStamp.value = new Date().getTime()
      } catch {
        // pass
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      roomSelect.value = roomList.value[0] ? roomList.value[0].id : undefined
    })

    return {
      roomSelect,
      roomList,
      rackList,
      currentRack,
      formOpen,
      getRackMount,
      currentRoom,
      timeStamp,
      loading,
      tableRef,
      selectItem,
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
    .top
      display: flex
      margin: 0 0 10px
      .row
        align-items: center
        p
          margin: 0 5px 0 0
      :deep(.el-button)
        margin: 0 0 0 10px
    a
      position: absolute
      top: 0
      left: 5px
      display: block
    :deep(.el-table)
      +size(100%,calc(100% - 52px))
      .el-button--mini
        min-height: auto
        padding: 5px 10px
      .el-button+.el-button
        margin-left: 0
        margin-top: 5px
</style>

<style lang="sass">
.addForm
  .el-form-item
    margin-bottom: 10px
  .btns
    +flex-center
</style>
