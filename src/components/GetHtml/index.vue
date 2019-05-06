<template>
  <div v-loading="loading" v-html="html" class="content"></div>
</template>
<style>
</style>
<script>
// 显示html路径的组件
// import axios from "axios";
const axios = require('axios');
export default {
  // 使用时请使用 :url.sync=""传值
  props: {
    url: {
      required: true
    }
  },
  data() {
    return {
      loading: false,
      html: ""
    };
  },
  watch: {
    url(value) {
      this.load(value);
    }
  },
  mounted() {
    this.load(this.url);
  },
  methods: {
    load(url) {
      if (url && url.length > 0) {
        // 加载中
        this.loading = true;
        axios
          .get(url)
          .then(response => {
            this.loading = false;
            // 处理HTML显示
            this.html = response.data;
            this.$emit("subFormatToHtml", this.html);
          })
          .catch(() => {
            this.loading = false;
            this.html = "服务器数据加载失败，请重试!";
            this.$emit("subFormatToHtml", this.html);
          });
      }
    }
  }
};
</script>

<style lang="scss" >
.el-loading-mask {
  position: absolute;
  z-index: 10000;
  background-color: rgba(255, 255, 255, 0.9);
  margin: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transition: opacity 0.3s;
}
.content {
  img {
    width: auto !important;
    max-width: 1020px !important;
  }
  ol,
  ol li {
    list-style-type: decimal;
  }

  ul,
  ul li {
    list-style-type: disc;
  }
  strong {
    font-weight: 700;
  }
  em {
    font-style: italic;
  }
  u {
    text-decoration: underline;
  }
  s {
    text-decoration: line-through;
  }
  h1 {
    font-size: 2em;
  }
  h2 {
    font-size: 1.5em;
  }
}
</style>
