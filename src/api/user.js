import request from "@/utils/request";
// 用户模块
export default class UserServe {
  // 用户列表
  static getUserList(params) {
    return request({
      url: `/users/`,
      method: "get",
      params
    });
  }
}
