<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
// import echarts from "echarts";

const echarts = require('echarts');
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
    chartData: {
      type: Object
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
    setOptions({ expectedData, actualData } = {}) {
      this.chart.setOption({
        title: {
          text: "用户地点分布"
        },
        grid: {
          left: 10,
          right: 50,
          bottom: 20,
          top: 50,
          containLabel: true
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: "category",
          data: [
            "西安",
            "成都",
            "天津",
            "郑州",
            "延安",
            "武汉",
            "南京",
            "青岛",
            "南宁",
            "其他"
          ]
        },
        legend: {
          data: ["单位：人", "2012年"]
        },
        series: [
          {
            name: "单位：人",
            type: "bar",
            data: [12, 20, 30, 6, 12, 33, 76, 9, 54, 23],
            itemStyle: {
              normal: {
                color: "#48D1CC"
              }
            }
          }
        ]
      });
    },
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      this.setOptions(this.chartData);
    }
  }
};
</script>
