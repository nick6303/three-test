<template lang="pug">
.Table
  el-table(
    :data="currentRack" border 
    v-loading="loading"
    highlight-current-row
    ref="tableRef"
  )
    el-table-column(
      prop="name" 
      label="名稱"
      align="center"
      header-align="center"
    )
    el-table-column(
      prop="rackmount_x" 
      label="X座標"
      align="center"
      header-align="center"
    )
    el-table-column(
      prop="rackmount_z" 
      label="Z座標"
      align="center"
      header-align="center"
    )
    el-table-column(
      prop="rackmodel" 
      label="機櫃型號"
      align="center"
      header-align="center"
    )
      template(#default="scope")
        span {{getRackName(scope.row)}}
    el-table-column(
      label="功能"
      align="center"
      header-align="center"
    )
      template(#default="scope")
        el-button(
          @click="editRack(scope)" 
          type="primary" plain 
          size="mini"
        ) 編輯
        el-button(
          @click="deleteRack(scope)" 
          type="danger" plain 
          size="mini"
        ) 刪除
  el-dialog(
    title="編輯機櫃"
    v-model="dialogVisible"
    width="30%"
  )
    el-form(
      ref="editForm" 
      :model="formData" 
      :rules="rules"
      :label-width="90"
    )
      el-form-item(
        label="名稱"
        prop="name"
      )
        el-input(v-model="formData.name")
      el-form-item(
        label="機櫃型號"
        prop="rackmodel"
      )
        el-select(
          v-model="formData.rackmodel"
        )
          el-option(
            v-for="item in rackList"
            :label="item.name"
            :value="item.id"
          )
      el-form-item(
        label="描述"
      )
        el-input(v-model="formData.description")
      .row
        el-form-item(
          label="X軸"
          prop="rackmount_x"
        )
          el-input(v-model="formData.rackmount_x")
        el-form-item(
          label="Z軸"
          prop="rackmount_z"
        )
          el-input(v-model="formData.rackmount_z")
    template(#footer)
      .btns
        el-button(
          @click="dialogVisible = false"
          type="danger" plain
          size="mini"
        ) 取消
        el-button(
          type="success" plain
          @click="checkValidate"
          size="mini"
        ) 儲存
</template>
<script>
import rackMountApi from '@api/rackMount'
import { reactive, ref } from '@vue/reactivity'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed } from '@vue/runtime-core'
import { useStore } from 'vuex'

export default {
  name: 'Table',
  props: {
    currentRack: Array,
    loading: Boolean,
  },
  emits: ['getRackMount'],
  setup(props, { emit }) {
    const store = useStore()
    const currentRack = computed(() => (props ? props.currentRack : []))
    const rackList = computed(() => store.state.rackList)
    const tableRef = ref(null)
    const dialogVisible = ref(false)
    const editForm = ref(null)
    const id = ref(null)

    const formData = reactive({
      rackmount_x: 0,
      rackmount_z: 0,
      rackmodel: 0,
      description: '',
      name: '',
    })

    const rules = {}
    Object.keys(formData).forEach((key) => {
      rules[key] = [{ required: true, message: '↑此項必填' }]
    })

    const getRackName = (row) => {
      const rack = rackList.value.find((item) => item.id === row.rackmodel)
      return rack.name
    }

    const editRack = (scope) => {
      const row = scope.row
      Object.keys(formData).forEach((key) => {
        if (row[key] !== null && row[key] !== undefined) {
          formData[key] = row[key]
        }
      })
      id.value = row.id
      dialogVisible.value = true
    }

    const deleteRack = async (scope) => {
      const row = scope.row
      try {
        await ElMessageBox.confirm('確認刪除？', '提醒', {
          confirmButtonText: '確認',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          cancelButtonClass: 'cancelButton',
          confirmButtonClass: 'confirmButton',
          type: 'warning',
        })

        await rackMountApi.delete(row.id)
        emit('getRackMount')
      } catch {
        // pass
      }
    }

    const setCurrent = (index) => {
      const row = currentRack.value[index]
      tableRef.value.setCurrentRow(row)
    }

    const checkValidate = () => {
      editForm.value.validate((valid) => {
        if (valid) {
          submitWhenValidate()
        }
      })
    }

    const submitWhenValidate = async () => {
      const postData = [{ ...formData }]
      try {
        postData.push(id.value)
        await rackMountApi.updatePartOf(...postData)

        ElMessage({
          type: 'success',
          message: '資料更新成功',
        })
        emit('getRackMount')
        dialogVisible.value = false
      } catch {
        // pass
      }
    }

    return {
      dialogVisible,
      editRack,
      deleteRack,
      editForm,
      checkValidate,
      formData,
      rules,
      tableRef,
      setCurrent,
      rackList,
      getRackName,
    }
  },
}
</script>
<style lang="sass" scoped>
.Table
  :deep(.el-table) td
    padding: 5px 0
  :deep(.el-dialog__body)
    padding: 10px 20px 0
</style>
