const COS = require("cos-js-sdk-v5");
import { postAuthorization } from "@/api/upload.js";
export const Bucket = process.env.VUE_APP_BUCKET;
export const Region = process.env.VUE_APP_REGION;
export const cos = new COS({
  getAuthorization: function(options, callback) {
    postAuthorization(
      (options.Method || "get").toLowerCase(),
      "/" + (options.Key || "")
    )
      .then(response => {
        callback(response.authorization);
      })
      .catch(() => {
        callback("error");
      });
  }
});

// base64转换成file文件
export function Base64ToBlob(urlData) {
  // 去掉url的头，并转换为byte
  let bytes = window.atob(urlData.split(",")[1]);

  // 处理异常,将ascii码小于0的转换为大于0
  let ab = new ArrayBuffer(bytes.length);
  let ia = new Uint8Array(ab);
  for (let i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i);
  }
  return new Blob([ab], {
    type: "image/png"
  });
}

// 文件扩展名提取
export function getFileType(fileName) {
  if (fileName && fileName.includes(".")) {
    return fileName.substring(fileName.lastIndexOf(".") + 1);
  }
}

// cos 地址路径
export function cosPath(type = "images", fileType = "png") {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  var time = date.toTimeString();
  time = time.substr(0, 8);
  time = time.replace(/:/g, "-");
  return (
    `/user-admin/${type}/` +
    (year +
      "-" +
      (month < 10 ? "0" + month : String(month)) +
      "-" +
      (day < 10 ? "0" + day : String(day)) +
      "-" +
      time) +
    "." +
    fileType
  );
}
