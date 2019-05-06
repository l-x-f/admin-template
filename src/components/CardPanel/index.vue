<template>
  <div
    class="card-panel"
    @click="handleClick()"
    :style="objectStyle"
    :class="{'cursor-pointer' : isClickLink}"
  >
    <a :title="isClickLink?title:''" :class="isClickLink?'card-link-pointer':'card-link'">
      <i v-if="isClickLink" class="fa fa-external-link margin-left-10 link-icon"></i>
      <div class="card-panel-icon-wrapper" :style="iconColorStyle">
        <slot class="card-panel-icon"></slot>
      </div>
      <div class="card-panel-icon-decription">
        <div class="card-panel-text">{{title}}</div>
        <span v-if="isCurrency">￥</span>
        <count-to
          v-if="!percentage"
          class="card-panel-num"
          :startVal="0"
          :endVal="value"
          :duration="3000"
          :decimals="decimals"
        ></count-to>
        <span v-if="percentage" class="card-panel-num">{{value}}</span>

        <span
          class="card-panel-num"
          v-if="percentage"
        >{{percentage*100 | accurateToTheSecondDecimalPlaces}}%</span>
        <span
          v-if="rate"
          :style="rateColorStyle"
        >{{symbol}}{{rate*100 | accurateToTheSecondDecimalPlaces}}%</span>
      </div>
    </a>
  </div>
</template>

<script>
// 统计数据的小卡片
import CountTo from "vue-count-to";

export default {
  components: {
    CountTo
  },
  props: {
    // 标题
    title: String,
    // 颜色
    color: String,
    // 背景色
    background: {
      type: String,
      default: "#fff"
    },
    // 宽度
    width: {
      type: Number,
      default: 240
    },
    // 数值
    value: {
      type: Number,
      default: 0
    },
    // 数据为百分比
    percentage: Number,
    // 小数位
    decimals: Number,
    // 上升，下降，比率，正值用绿色表示，负值用红色表示
    rate: {
      type: Number,
      default: 0
    },
    // 上升=1，下降=-1，不变=0
    dataChange: {
      type: Number,
      default: 0
    },
    // 能否点击进入
    isClickLink: {
      type: Boolean,
      default: true
    },
    // 是否是金钱
    isCurrency: {
      type: Boolean,
      default: false
    }
  },
  created() {},
  data() {
    return {
      // 设置样式
      objectStyle: {
        width: this.width + "px",
        background: this.background
      },
      // 卡片颜色
      iconColorStyle: {
        color: this.color,
        background: this.background
      },
      // 上升/下降比率颜色
      rateColorStyle: {
        color: this.rate < 0 ? "green" : "red",
        fontSize: "12px"
      }
    };
  },
  computed: {
    // 上升为 +, 下降为 -
    symbol: function() {
      return this.rate < 0 ? "" : "+";
    }
  },
  methods: {
    // 点击事件
    handleClick() {
      this.$emit("handleClick", this.title);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.card-panel {
  height: 108px;
  font-size: 12px;
  position: relative;
  overflow: hidden;
  color: #373737;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 5px 5px 5px #e5e9f2;
  .card-panel-icon-wrapper {
    float: left;
    margin: 30px 0 0 10px;
    padding: 10px;
    transition: all 0.38s ease-out;
    border-radius: 6px;
  }
  .card-panel-icon {
    float: left;
    font-size: 48px;
  }
  .card-panel-icon-decription {
    float: left;
    font-weight: bold;
    margin-top: 26px;
    margin-left: 10px;
    .card-panel-text {
      line-height: 18px;
      color: rgba(0, 0, 0, 0.45);
      font-size: 14px;
      margin-bottom: 12px;
    }
    .card-panel-num {
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

.color-green {
  color: green;
}

.color-red {
  color: red;
}
</style>