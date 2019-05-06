import request from "@/utils/request";
const md5 = require("js-md5");

// 登录
export function login(username, password) {
  const data = {
    username,
    password: md5(password)
  };
  return request({
    url: "/auth/login",
    method: "post",
    data
  });
}
