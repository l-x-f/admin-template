<template>
  <div :style="{width: width + 'px'}">
    <table width="100%">
      <tr>
        <td class="label-width">
          <span class="font-size-14">{{ label }}</span>
        </td>
        <td>
          <div class="total">
            <div class="deep-color" :style="{width: count*100/total + '%'}">&nbsp;</div>
          </div>
        </td>
        <td class="user-count-td-width">
          <span class="user-count-span">{{ count }} 人</span>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
// 柱状横线图，用来表示百分比数值

export default {
  props: {
    width: {
      type: Number
    },
    // 标签
    label: {
      type: String,
      default: ''
    },
    // 数字
    count: {
      type: Number,
      default: 0
    },
    // 总数
    total: {
      type: Number,
      default: 100
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.label-width {
  width: 50px;
}

.total {
  background: #eee;
  width: 100%;
}

.user-count-td-width {
  width: 70px;
}

.user-count-span {
  font-size: 14px;
  color: #999;
  margin-left: 10px;
}
</style>
