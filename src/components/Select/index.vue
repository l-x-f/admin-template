<template>
  <div>
    <el-select v-model="selected" :style="{width: width + 'px'}" placeholder="请选择" size="small" @change="handleChangeSelect()">
      <el-option v-for="item in option" :key="item" :label="item" :value="item" />
    </el-select>
  </div>
</template>

<script>
// 选择组件
export default {
  props: {
    // 名称列表
    option: {
      type: [Array, Object],
      default: function() {
        return []
      }
    },
    // 初始值
    value: {
      type: String,
      default: ''
    },
    // 宽度
    width: Number
  },
  data() {
    return {
      // 列表
      // options: this.names,
      // 已选择的值
      selected: ''
    }
  },
  watch: {
    // 已选择的
    value: function(val) {
      // console.log("aaaa", val);
      this.selected = val
    }
  },
  created() {
    // 初始值
    if (this.value) {
      this.selected = this.value
    }
  },
  methods: {
    // 已选择的值
    handleChangeSelect() {
      this.$emit('subSelected', this.selected)
      this.$emit('update:value', this.selected)
    },
    // 设置类名
    setSelectClass() {
      return { width: '100px' }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-select {
  width: 200px;
}
</style>
