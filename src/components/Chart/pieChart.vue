<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
// import echarts from "echarts";
const echarts = require("echarts");

import { debounce } from "@/utils";

export default {
  props: {
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "280px"
    },
    // 图例标签
    legendData: {
      type: Array
    },
    // 图表数据
    series: {
      type: Array
    },
    // 标题
    title: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      chart: null
    };
  },
  watch: {
    // 监听标题改变
    title(val) {
      this.reDraw();
    },
    // 监听数据改变
    series(val) {
      this.reDraw();
    },
    // 监听图例改变
    legendData(val) {
      this.reDraw();
    }
  },
  mounted() {
    this.initChart();
    this.__resizeHanlder = debounce(() => {
      if (this.chart) {
        this.chart.resize();
      }
    }, 100);
    window.addEventListener("resize", this.__resizeHanlder);
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    window.removeEventListener("resize", this.__resizeHanlder);
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");

      this.chart.setOption({
        title: {
          text: this.title,
          left: "center",
          bottom: 0,
          textStyle: {
            color: "black",
            fontSize: 14
          }
        },
        labelLine: {
          normal: {
            smooth: 0.2,
            length: 0,
            length2: 0
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          left: "center",
          bottom: 40,
          textStyle: {
            color: "#999",
            fontSize: 12
          },
          data: this.legendData
        },
        calculable: true,
        series: this.series
      });
    },
    // 重新绘制
    reDraw() {
      if (!this.chart) {
        return;
      }
      window.removeEventListener("resize", this.__resizeHanlder);
      this.chart.dispose();
      this.chart = null;
      this.initChart();
    }
  }
};
</script>

<style lang="scss" scoped>

</style>