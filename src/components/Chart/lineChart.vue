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
      default: "350px"
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    // 数据
    chartData: {
      type: [Object, Array]
    },
    // 图例
    legendData: {
      type: Array
    },
    // 横轴的坐标标签
    xAxisData: {
      type: Array
    }
  },
  data() {
    return {
      chart: null
    };
  },
  mounted() {
    this.initChart();
    if (this.autoResize) {
      this.__resizeHanlder = debounce(() => {
        if (this.chart) {
          this.chart.resize();
        }
      }, 100);
      window.addEventListener("resize", this.__resizeHanlder);
    }

    // 监听侧边栏的变化
    const sidebarElm = document.getElementsByClassName("sidebar-container")[0];
    if (sidebarElm) {
      sidebarElm.addEventListener("transitionend", this.__resizeHanlder);
    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    if (this.autoResize) {
      window.removeEventListener("resize", this.__resizeHanlder);
    }

    const sidebarElm = document.getElementsByClassName("sidebar-container")[0];
    if (sidebarElm) {
      sidebarElm.removeEventListener("transitionend", this.__resizeHanlder);
    }
    this.chart.dispose();
    this.chart = null;
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val);
      }
    }
  },
  methods: {
    setOptions({ series } = {}) {
      this.chart.setOption({
        type: "category",
        xAxis: {
          data: this.xAxisData,
          boundaryGap: false,
          // 坐标轴刻度相关设置。
          axisTick: {
            inside: false,
            length: 5,
            lineStyle: {
              color: "gray",
              shadowColor: "gray",
              shadowOffsetY: 0
            }
          },
          // 刻度标签与轴线之间的距离。
          axisLabel: {
            margin: 16
          },
          // 设置坐标轴字体颜色和宽度
          axisLine: {
            lineStyle: {
              color: "gray",
              width: 2
            }
          }
        },
        // 直角坐标系内绘图网格设置
        grid: {
          left: 30,
          right: 50,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross"
          },
          padding: [5, 10]
        },
        yAxis: {
          // 坐标轴刻度相关设置。
          axisTick: {
            inside: false,
            length: 5,
            lineStyle: {
              color: "gray",
              shadowColor: "gray",
              shadowOffsetY: 0
            }
          },
          // 刻度标签与轴线之间的距离。
          axisLabel: {
            margin: 16
          },
          // 设置坐标轴字体颜色和宽度
          axisLine: {
            lineStyle: {
              color: "gray",
              width: 2
            }
          }
        },
        legend: {
          data: this.legendData
        },
        series: series
      });
    },
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      this.setOptions(this.chartData);
    }
  }
};
</script>
