<template>
  <div class="card-link cursor-pointer" :style="objectStyle" @click="handleClick()">
    <a :title="title" :alt="title" class="card-link-pointer">
      <i class="fa fa-external-link margin-left-10 link-icon" />
      <div class="card-link-icon-wrapper" :style="iconColorStyle">
        <slot class="card-link-icon" />
      </div>
      <div class="card-link-icon-decription">
        <div class="card-link-text">{{ title }}</div>
      </div>
    </a>
  </div>
</template>

<script>
// 可点击的小卡片

export default {
  props: {
    // 标题
    title: String,
    // 颜色
    color: String,
    // 宽度
    width: {
      type: Number,
      default: 220
    }
  },
  data() {
    return {
      // 设置样式
      objectStyle: {
        width: this.width + 'px',
        background: '#fff'
      },
      // 卡片颜色
      iconColorStyle: {
        color: this.color,
        background: '#fff'
      }
    }
  },
  methods: {
    // 点击事件
    handleClick() {
      this.$emit('handleClick', this.title)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.card-link {
  height: 100px;
  font-size: 12px;
  position: relative;
  overflow: hidden;
  color: #666;
  box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.05);
  .card-link-icon-wrapper {
    float: left;
    margin: 14px 0 0 14px;
    padding: 16px;
    transition: all 0.38s ease-out;
    border-radius: 6px;
  }
  .card-link-icon {
    float: left;
    font-size: 48px;
  }
  .card-link-icon-decription {
    float: left;
    font-weight: bold;
    margin: 26px;
    margin-left: 10px;
    margin-top: 40px;
    .card-link-text {
      line-height: 18px;
      color: rgba(0, 0, 0, 0.45);
      font-size: 18px;
      margin-bottom: 12px;
    }
    .card-link-num {
      font-size: 20px;
    }
  }
  .link-icon {
    color: rgb(100, 149, 237);
    position: absolute;
    right: 10px;
    top: 10px;
  }
}

</style>
