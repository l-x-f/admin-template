<template>
  <div>
    <el-dialog
      top="20vh"
      ref="dialog"
      :title="title"
      :before-close="cancelDialog"
      :visible.sync="dialogVisible"
      width="30%"
      center
    >
      <el-input v-model.number="inputValue" :placeholder="placeholder"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog" size="small">
          <i class="fa fa-history"></i>取消
        </el-button>
        <el-button type="primary" @click="save" size="small">
          <i class="fa fa-sort"></i>确定
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
      default: "请输入序号",
      type: String
    },
    title: {
      default: "修改排序",
      type: String
    },
    sortValue: null
  },
  watch: {
    sortValue(val) {
      this.inputValue = val;
    },
    inputValue(val) {
      this.$emit("update:sortValue", val);
    }
  },
  data() {
    return { inputValue: "" };
  },
  methods: {
    save() {
      if (!this.inputValue) {
        this.$message({
          message: "请输入序号！",
          type: "warning"
        });
        return;
      }
      this.$emit("save", this.inputValue);
    },
    cancelDialog() {
      this.inputValue = "";
      this.$emit("cancel");
    }
  }
};
</script>
