import { login } from "@/api/login";
import { getToken, setToken, removeToken } from "@/utils/auth";
import router, { resetRouter } from "@/router";

const state = {
  token: getToken(),
  name: "",
  avatar: "",
  introduction: "",
  roles: []
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  }
};

const actions = {
  //用户登录
  async login({ commit }, userInfo) {
    try {
      const { username, password } = userInfo;
      // const { accessToken } = await login(username, password);
      
      // test
      let accessToken = "admin-token";
      commit("SET_TOKEN", accessToken);
      setToken(accessToken);
      return res;
    } catch (error) {
      return error;
    }
  },

  // 获取用户信息  src/permission.js里做权限校验
  async getInfo({ commit, state }) {
    try {
      let data = {
        avatar:
          "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
        introduction: "I am a super administrator",
        name: "Super Admin",
        roles: ["admin"]
      };
      const { roles, name, avatar, introduction } = data;
      commit("SET_ROLES", roles);
      commit("SET_NAME", name);
      commit("SET_AVATAR", avatar);
      commit("SET_INTRODUCTION", introduction);
      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  },

  //退出登录
  async logout({ commit, state }) {
    commit("SET_TOKEN", "");
    commit("SET_ROLES", []);
    removeToken();
    resetRouter();
    return true;
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit("SET_TOKEN", "");
      commit("SET_ROLES", []);
      removeToken();
      resolve();
    });
  },

  // Dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + "-token";

      commit("SET_TOKEN", token);
      setToken(token || "token");

      const { roles } = await dispatch("getInfo");

      resetRouter();

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch("permission/generateRoutes", roles, {
        root: true
      });

      // dynamically add accessible routes
      router.addRoutes(accessRoutes);

      resolve();
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
