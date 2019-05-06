<template>
  <div :style="center?'text-align: center':''">
    <el-button size="small" v-if="back" @click="handleBack()">
      <i class="fa fa-history"></i>
      {{backText}}
    </el-button>
    <el-button size="small" type="primary" @click="handleSave()">
      <i class="fa fa-save"></i>
      {{saveText}}
    </el-button>
  </div>
</template>

<script>
// 保存，返回按钮组
export default {
  props: {
    backText: {
      type: String,
      default: "返回"
    },
    saveText: {
      type: String,
      default: "确定"
    },
    center: {
      type: Boolean,
      default: false
    },
    back: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    // 保存事件
    handleSave() {
      this.$emit("save");
    },
    // 返回事件
    handleBack() {
      if (this.backText === "返回") {
        this.$router.go(-1);
      } else {
        this.$emit("subCancel");
      }
    }
  }
};
</script>

