<template>
  <div>
    <el-dialog
      top="30vh"
      ref="dialog"
      title="重要提示"
      :before-close="cancelDialog"
      :visible.sync="dialogVisible"
      width="30%"
      center
    >
      <div class="text-center">{{text}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog" size="small">
          <i class="fa fa-history"></i>取消
        </el-button>
        <el-button type="primary" @click="deleteConfirm" size="small">
          <i class="fa fa-check"></i>确定
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
    text: {
      default: "请确认是否将该内容删除？",
      type: String
    }
  },
  data() {
    return {};
  },
  methods: {
    deleteConfirm() {
      this.$emit("confirm");
    },
    cancelDialog() {
      this.$emit("cancel");
    }
  }
};
</script>
