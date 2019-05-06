import request from "@/utils/request";

// oss上传获取认证信息
export function getAuthorization() {
  return request({  
    url: "/qcloud/oss_sign",
    method: "post"
  });
}
// cos上传获取认证信息
export function postAuthorization(methods, pathname) {
  return request({
    url: 'qcloud/cos_sign',
    method: "post",
    data: { method: methods, pathname: pathname }
  });
}

// cos上传点播视频获取认证信息
export function getVodSignature() {
  return request({
    url: "/qcloud/video_sign",
    method: "post"
  });
}
