<template lang="pug">
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
  el-form(
    :model="formData" 
    :rules="rules"
    :label-width="90"
  )
    el-form-item(
      label="機櫃型號"
      prop="rackmodel"
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
    el-form-item(
      label="名稱"
      prop="name"
    )
      el-input(
        v-model="formData.name"
        size="mini"
      )
    el-form-item(
      label="描述"
    )
      el-input(
        v-model="formData.description"
        size="mini"
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
</template>
<script>
import { computed, ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import rackMountApi from '@api/rackMount'
import { useStore } from 'vuex'

export default {
  name: 'AddRackMount',
  props: {
    roomSelect: Number,
  },
  emits: ['getRackMount'],
  setup(props, { emit }) {
    const store = useStore()
    const roomSelect = computed(() => (props ? props.roomSelect : null))
    const rackList = computed(() => store.state.rackList)
    const formOpen = ref(false)
    const formData = reactive({
      rackmount_x: 0,
      rackmount_y: 0,
      rackmount_z: 0,
      rackmount_json: {},
      rackmodel: null,
      description: '',
      name: '',
    })

    const rules = {}
    Object.keys(formData).forEach((key) => {
      rules[key] = [{ required: true, message: '↑此項必填' }]
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
      if (!formData.rackmodel) {
        ElMessage({
          type: 'error',
          message: '請選擇機櫃型號',
        })
        return
      }
      try {
        const params = {
          ...formData,
          datacenter: roomSelect.value,
        }
        await rackMountApi.addItem(params)
        emit('getRackMount')
        formOpen.value = false
      } catch {
        // pass
      }
    }
    return {
      openAdd,
      formOpen,
      addRack,
      formData,
      rackList,
      rules,
    }
  },
}
</script>
