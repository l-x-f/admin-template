<template>
  <el-dialog title="审核" :visible.sync="dialogVisible" width="40%" center>
    <span class="font-size-12 padding-bottom-20 tip">注：通过无需填写内容，但是驳回需要填写原因</span>
    <el-input class="margin-top-10" v-model="reason" type="textarea" :rows="2"></el-input>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" size="small">
        <i class="fa fa-history"></i> 取消
      </el-button>

      <el-button @click="handleRejectAudit" :loading="rejectLoading" size="small">
        <i class="fa fa-times-circle"></i> 驳回
      </el-button>
      <el-button type="primary" :loading="passLoading" @click="handlePassAudit" size="small">
        <i class="fa fa-check-circle-o"></i> 通过
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
// 审核的弹出框，审核通过，审核拒绝，取消
// import { Message } from "element-ui";
// import { audit } from "@/api/auditDialog";

export default {
  props: {
    // 对话框是否可见
    visibility: {
      type: Boolean,
      default: false
    },
    count: {
      type: null,
      default: 0
    }
  },
  data() {
    return {
      // 对话框是否可见
      dialogVisible: this.visibility,
      // loading通过按钮状态
      passLoading: false,
      // loading拒绝按钮状态
      rejectLoading: false,
      // 拒绝原因
      reason: ""
    };
  },
  watch: {
    // 观察父组件的prop是否发生变化
    visibility: function(val) {
      this.dialogVisible = val;
    },
    // 对prop进行双向数据绑定，当子组件数据改变时候，通知父组件更新数据，需要在父组件prop加上.sync
    dialogVisible: function(val) {
      this.$emit("update:visibility", val);
    }
  },
  methods: {
    // 审核通过
    handlePassAudit() {
      this.$emit("pass");
    },
    // 审核拒绝
    handleRejectAudit() {
      this.$emit("reject", { data: this.reason });
    }
  }
};
</script>

<style lang="scss" scoped>
.tip {
  color: red;
}
</style>
