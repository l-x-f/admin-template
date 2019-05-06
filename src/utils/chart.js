// 折线图默认数据
const defaultLineSeries = {
  name: "expected",
  itemStyle: {
    normal: {
      color: "#F4D020",
      lineStyle: {
        color: "#F4D020",
        width: 2
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: 'rgba(255,255,0,0.5)' // 0% 处的颜色
          }, {
            offset: 1,
            color: 'rgba(255,255,0,0.5)' // 100% 处的颜色
          }],
          globalCoord: false // 缺省为 false
        }
      }
    }
  },
  smooth: true,
  type: "line",
  data: [100, 120, 161, 134, 105, 160, 165],
  animationDuration: 2800,
  animationEasing: "cubicInOut"
};
// 饼状图默认数据
// eg. defaultPieSeries legend = ["男", "女", "未知"], data = [320, 240, 149];
const defaultPieSeries = {
  name: "性别分布",
  type: "pie",
  roseType: "radius",
  radius: [5, 55],
  center: ["50%", "35%"],
  data: [{
      value: 320,
      name: "男"
    },
    {
      value: 240,
      name: "女"
    },
    {
      value: 149,
      name: "未知"
    }
  ],
  animationEasing: "cubicInOut",
  animationDuration: 2600
};

// 设置折线图图表数据
export function setLineChartSeries(name, data, config) {
  // 设置series
  var series = {};
  Object.assign(series, defaultLineSeries);
  // 重新设置
  series = Object.assign(series, config)
  // 设置data和name
  series.data = data;
  series.name = name;
  // 返回值
  return series;
}

// 设置饼状图图表数据
export function setPieChartSeries(name, legend, data, config) {
  // 设置data
  var arr = [];
  if (legend && data && legend.length && data.length) {
    for (var i = 0; i < legend.length; i++) {
      arr.push({
        value: data[i],
        name: legend[i]
      });
    }
  }
  // 设置series
  var series = {};
  Object.assign(series, defaultPieSeries);
  series.name = name;
  series.data = arr;
  // 返回值
  return [].concat(Object.assign(series, config));
}
