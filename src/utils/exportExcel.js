// 导出excel 2018-5-28-by-lxf
//调用说明:   
//  1. 在其他文件中先导入此文件 import exportExcel from "(path)/exportExcel.js";
//  2. 传递参数如下(fileName和callback是可选参数 --------  data和options是必选参数且一一对应);
//  3. 调用示例 
//  exportExcel({
//    fileName: "excel",
//    options: {name: "名字",gender: "性别"  },
//    data: [{ name: '小明',gender: '男'},{name: '小,gender: '女'}],
//    callback: function () {
//      console.log('回调')
//    }
//  });
/**
 * 
 * @param {*} obj 
 * @return {excel-file}
 */
export default function exportExcel(obj = {}) {
  if (obj.data.length == 0) {
    window.ELEMENT.Message({
      message: "没有数据无法导出",
      type: 'warning',
      duration: 2 * 1000
    })
    return false
  }
  if (Object.prototype.toString.call(obj.options) !== '[object Object]') {
    throw new Error('options配置类型必须是Object类型');
  }
  if (Object.prototype.toString.call(obj.data) !== '[object Array]') {
    throw new Error('data数据类型必须是Array类型');
  }
  import("@/vendor/Export2Excel").then(excel => {
    //  表头
    let tHeader = [];
    //  数据key值
    let filterVal = [];
    //  根据配置添加excel表头和数据key值
    for (const key in obj.options) {
      tHeader.push(obj.options[key]);
      filterVal.push(key);
    }
    //  数据
    const data = formatJson(filterVal, obj.data);
    //  导出excel
    excel.export_json_to_excel({
      header: tHeader,
      data,
      filename: obj.fileName || '导出文件',
      autoWidth: true
    });
    //  回调函数
    if (obj.callback && typeof obj.callback == 'function') {
      obj.callback();
    }
    //  格式化数据函数
    function formatJson(filterVal, objData) {
      return objData.map(v =>
        filterVal.map(j => {
          if (j == "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    }

  });

}
