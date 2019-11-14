<template>
  <el-radio-group v-model="selected" size="small">
    <el-radio v-for="(name,index) in names" :key="index" :disabled="disabled" :label="name">{{ name }}</el-radio>
  </el-radio-group>
</template>

<script>
// 按钮组组件
export default {
  name: 'RadioButton',
  // model: {
  //   prop: "checked",
  //   event: "change"
  // },
  props: {
    // 按钮组名称
    names: {
      type: Array,
      default: function() {
        return ['是', '否']
      }
    },
    // 值
    value: {
      type: String,
      default: '否'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    type: String
  },
  data() {
    return {
      selected: ''
    }
  },

  watch: {
    value: function(val) {
      console.log(val, 'val')
      this.selected = val
    },
    selected: function(res) {
      let val = ''
      let num = 0
      if (res == '是') {
        val = true
        num = 1
      } else {
        val = false
        num = 0
      }

      const data = {
        selected: val,
        selectedNumber: num,
        type: this.type
      }
      if (!this.type) {
        delete data.type
      }
      // 需要false true 的情况
      this.$emit('subChange', data)
      // 需要具体值情况
      this.$emit('subRadioChange', res)
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 初始化
    init() {
      this.selected = this.value
    },

    handleChange() {
      let value
      if (this.selected == '是') {
        value = true
      } else {
        value = false
      }
      const data = {
        selected: value,
        type: this.type
      }
      this.$emit('subChange', data)
      this.$emit('update:value', this.value)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
