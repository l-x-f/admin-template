<template>
  <div>
    <el-dialog
      ref="dialog"
      top="20vh"
      :title="title"
      :before-close="cancelDialog"
      :visible.sync="dialogVisible"
      width="30%"
      center
    >
      <el-input v-model.number="inputValue" :placeholder="placeholder" />
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancelDialog">
          <i class="fa fa-history" />取消
        </el-button>
        <el-button type="primary" size="small" @click="save">
          <i class="fa fa-sort" />确定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    dialogVisible: {
      required: true,
      default: false,
      type: Boolean
    },
    placeholder: {
      default: '请输入序号',
      type: String
    },
    title: {
      default: '修改排序',
      type: String
    },
    sortValue: null
  },
  data() {
    return { inputValue: '' }
  },
  watch: {
    sortValue(val) {
      this.inputValue = val
    },
    inputValue(val) {
      this.$emit('update:sortValue', val)
    }
  },
  methods: {
    save() {
      if (!this.inputValue) {
        this.$message({
          message: '请输入序号！',
          type: 'warning'
        })
        return
      }
      this.$emit('save', this.inputValue)
    },
    cancelDialog() {
      this.inputValue = ''
      this.$emit('cancel')
    }
  }
}
</script>
