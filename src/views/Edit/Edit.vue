<template lang="pug">
#Edit
  .cabinets
    router-link(to="/") 回到預覽
    .top
      .row
        p 機房
        el-select(v-model="roomSelect")
          el-option(
            v-for="item in roomList"
            :value="item.id"
            :label="item.name"
          )
      el-popover(
        placement="bottom"
        trigger="manual"
        :width="300"
        popper-class="addForm"
        v-model:visible="formOpen"
      )
        template(#reference)
          el-button(
            type="success" plain
            @click="openAdd"
          ) 新增機櫃
        el-form
          el-form-item(
            label="機櫃型號"
          )
            el-select(
              v-model="formData.rackmodel"
              size="mini"
            )
              el-option(
                v-for="item in rackList"
                :label="item.name"
                :value="item.id"
              )
          .btns
            el-button(
              type="danger" plain
              size="mini"
              @click="formOpen = false"
            ) 取消
            el-button(
              type="success" plain
              size="mini"
              @click="addRack"
            ) 確認
    el-table(:data="currentRack" border)
      el-table-column(prop="id" label="機櫃代號")
      el-table-column(prop="rackmount_x" label="X座標")
      el-table-column(prop="rackmount_z" label="Z座標")
      el-table-column(label="功能")
        template(#default="scope")
          el-button(
            @click="handleClick(scope.row)" 
            type="text" 
            size="small"
          ) 編輯
  //- Preview(
  //-   v-if="roomSelect"
  //-   :roomSelect="roomSelect"
  //-   :rackData="currentRack"
  //- )
</template>
<script>
import { computed, onMounted, reactive, ref } from 'vue'
import roomApi from '@api/dataCenter'
import rackApi from '@api/rackModel'
import rackMountApi from '@api/rackMount'
import { Preview } from './components'
import { ElMessage } from 'element-plus'

export default {
  name: 'Edit',
  components: {
    Preview,
  },
  setup() {
    const roomList = ref([])
    const rackList = ref([])
    const rackMountList = ref([])
    const roomSelect = ref(null)
    const formOpen = ref(false)
    const formData = reactive({
      rackmount_x: 0,
      rackmount_y: 0,
      rackmount_z: 0,
      rackmount_json: {},
      // datacenter: 0,
      rackmodel: null,
    })

    const currentRack = computed(() => {
      if (!roomSelect.value) {
        return []
      }

      return rackMountList.value.filter((item) => {
        return item.datacenter === roomSelect.value
      })
    })

    const openAdd = () => {
      if (roomSelect.value) {
        formOpen.value = true
      } else {
        ElMessage({
          type: 'error',
          message: '請先選擇機房',
        })
      }
    }

    const addRack = async () => {
      try {
        const params = { ...formData, datacenter: roomSelect.value }
        await rackMountApi.addItem(params)
      } catch {
        // pass
      }
    }

    const getRoomList = async () => {
      roomList.value = await roomApi.getList()
    }

    const getRackList = async () => {
      rackList.value = await rackApi.getList()
    }

    const getRackMount = async () => {
      rackMountList.value = await rackMountApi.getList()
    }

    onMounted(() => {
      getRoomList()
      getRackList()
      getRackMount()
    })

    return {
      roomSelect,
      roomList,
      rackList,
      currentRack,
      formOpen,
      openAdd,
      formData,
      addRack,
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
      +size(100%,calc(100% - 50px))
</style>

<style lang="sass">
.addForm
  .el-form-item
    margin-bottom: 10px
  .btns
    +flex-center
</style>
