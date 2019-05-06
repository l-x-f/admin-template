<template>
  <el-radio-group v-model="selected" size="small">
    <el-radio :disabled="disabled" :label="name" v-for="(name,index) in names" :key="index">{{name}}</el-radio>
  </el-radio-group>
</template>

<script>
// 按钮组组件
export default {
  name: "radio-button",
  created() {
    this.init();
  },
  data() {
    return {
      selected: ""
    };
  },
  // model: {
  //   prop: "checked",
  //   event: "change"
  // },
  props: {
    // 按钮组名称
    names: {
      type: Array,
      default: function() {
        return ["是", "否"];
      }
    },
    // 值
    value: {
      type: String,
      default: "否"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    type: String
  },
  methods: {
    // 初始化
    init() {
      this.selected = this.value;
    },

    handleChange() {
      let value;
      if (this.selected == "是") {
        value = true;
      } else {
        value = false;
      }
      let data = {
        selected: value,
        type: this.type
      };
      this.$emit("subChange", data);
      this.$emit("update:value", this.value);
    }
  },

  watch: {
    value: function(val) {
      console.log(val,"val")
      this.selected = val;
    },
    selected: function(res) {
      let val = "";
      let num = 0;
      if (res == "是") {
        val = true;
        num = 1;
      } else {
        val = false;
        num = 0;
      }

      let data = {
        selected: val,
        selectedNumber: num,
        type: this.type
      };
      if (!this.type) {
        delete data.type;
      }
      // 需要false true 的情况
      this.$emit("subChange", data);
      // 需要具体值情况
      this.$emit("subRadioChange", res);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>