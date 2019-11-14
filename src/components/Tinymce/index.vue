<template>
  <div class="tinymce-container editor-container" :class="{fullscreen:fullscreen}">
    <textarea :id="tinymceId" class="tinymce-textarea" />
    <div class="editor-custom-btn-container">
      <editorImage class="editor-upload-btn" @success="imageSuccess" />
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import editorImage from './components/editorImage'
import plugins from './plugins'
import toolbar from './toolbar'
import zh_CN from './langs/zh_CN.js'
// import { Bucket, Region, cos, Base64ToBlob, cosPath } from "@/utils/cos";
// import { getUploadPathTimestamp } from "@/utils/editor";
import { getAuthorization } from '@/api/upload'

export default {
  name: 'Tinymce',
  components: { editorImage },
  props: {
    id: {
      type: String
    },
    path: {
      type: String,
      default: 'html/details/content/'
    },
    // value: {
    //   type: String,
    //   default: ""
    // },
    html: {
      type: String,
      default: ''
    },
    isUrl: {
      type: Boolean,
      default: true
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return []
      }
    },
    menubar: {
      default: false
    },
    height: {
      type: Number,
      required: false,
      default: 400
    }
  },
  data() {
    return {
      filename: null,
      params: {},
      fileData: null,
      formData: {},
      host: '',
      fileType: '',
      hasChange: false,
      hasInit: false,
      tinymceId: this.id || 'vue-tinymce-' + +new Date(),
      fullscreen: false,
      value: '',
      editorContent: ''
    }
  },
  watch: {
    value(val) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() =>
          window.tinymce.get(this.tinymceId).setContent(val || '')
        )
      }
    },
    html: function(val) {
      // console.log(val);
      if (this.isUrl) {
        this.loadUrl(val)
      } else {
        this.value = val + ''
      }
    }
  },
  created() {
    if (
      this.html &&
      (this.html.includes('https://') || this.html.includes('http://'))
    ) {
      this.loadUrl(this.html)
    } else {
      this.value = this.html + ''
    }
  },
  mounted() {
    this.initTinymce()
  },
  activated() {
    this.initTinymce()
  },
  deactivated() {
    this.destroyTinymce()
  },
  destroyed() {
    this.destroyTinymce()
  },
  methods: {
    initTinymce() {
      const _this = this
      window.tinymce.init({
        fontsize_formats: '12px 14px 16px 18px 20px 24px 36px',
        language_url: zh_CN,
        selector: `#${this.tinymceId}`,
        height: this.height,
        body_class: 'panel-body ',
        object_resizing: false,
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        menubar: this.menubar,
        plugins: plugins,
        end_container_on_empty_block: true,
        powerpaste_word_import: 'clean',
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        // imagetools_cors_hosts: ["www.tinymce.com", "codepen.io"],
        default_link_target: '_blank',
        link_title: false,
        init_instance_callback: editor => {
          if (_this.value) {
            editor.setContent(_this.value)
          }
          _this.hasInit = true
          editor.on('NodeChange Change KeyUp SetContent', () => {
            this.hasChange = true
            this.$emit('input', editor.getContent())
            this.editorContent = editor.getContent()
          })
        },
        setup(editor) {
          editor.on('FullscreenStateChanged', e => {
            _this.fullscreen = e.state
          })
        }
      })
    },
    destroyTinymce() {
      if (window.tinymce.get(this.tinymceId)) {
        window.tinymce.get(this.tinymceId).destroy()
      }
    },
    async loadUrl(url) {
      // console.log(url, "url");
      if (url && url.length > 0) {
        try {
          const response = await axios.get(url)
          this.value = response.data
          this.$emit('subLoadUrlToHtml', response.data)
        } catch (error) {
          this.value = '服务器数据加载失败，请重试!'
        }
      }
    },
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value)
    },
    getContent() {
      window.tinymce.get(this.tinymceId).getContent()
    },
    imageSuccess({ urlData, file }) {
      this.fileType = file.type
      this.params.file = file
      this.getOssData()
      console.log(file, 'file')
      // });
    },
    // 编辑器内容上传到cos，调用返回url
    async content2Url() {
      try {
        const res = await getAuthorization()
        this.params = { ...this.params, ...res }
        this.host = 'https://' + res.host
        const params = this.params
        // 设置请求参数
        const formData = new FormData()
        // 文件时间戳
        const date = Date.parse(new Date())
        // 文件名
        const filename = `${this.path + date}.html`
        this.filename = filename
        // 文件名字，可设置路径
        formData.append('key', `${filename}`)
        // policy规定了请求的表单域的合法性
        formData.append('policy', params.policy)
        // Bucket 拥有者的Access Key Id
        formData.append('OSSAccessKeyId', params.accessid)
        // 让服务端返回200,不然，默认会返回204
        formData.append('success_action_status', '200')
        // 根据Access Key Secret和policy计算的签名信息，OSS验证该签名信息从而验证该Post请求的合法性
        // formData.append("callback", params.callback);
        formData.append('signature', params.signature)
        formData.append('name', filename)
        // 需要上传的文件file
        const content = this.editorContent || this.value
        const htmlFile = new Blob([content], { type: 'text/html' }) // 创建Blob对象
        this.params.file = htmlFile
        formData.append('file', params.file, filename)
        this.formData = formData
        // 数据发送到后端
        const response = await axios.post(this.host, this.formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        const data = response.request.responseURL + this.filename
        // 返回一个promise
        return data
      } catch (error) {
        console.log(error)
        return error
      }
    },

    // 获取服务端传递过来的阿里oss签名
    async getOssData() {
      try {
        const res = await getAuthorization()
        this.params = { ...this.params, ...res }
        this.host = 'https://' + res.host
        this.setParams()
      } catch (error) {
        console.log(error)
      }
    },
    // 设置html参数
    setHtmlParams() {
      const params = this.params
      // 设置请求参数
      const formData = new FormData()
      // 文件时间戳
      const date = Date.parse(new Date())
      // 文件名
      const filename = `${this.path + date}.${this.fileType.split('/')[1]}`
      this.filename = filename
      // 文件名字，可设置路径
      formData.append('key', `${filename}`)
      // policy规定了请求的表单域的合法性
      formData.append('policy', params.policy)
      // Bucket 拥有者的Access Key Id
      formData.append('OSSAccessKeyId', params.accessid)
      // 让服务端返回200,不然，默认会返回204
      formData.append('success_action_status', '200')
      // 根据Access Key Secret和policy计算的签名信息，OSS验证该签名信息从而验证该Post请求的合法性
      // formData.append("callback", params.callback);
      formData.append('signature', params.signature)
      formData.append('name', filename)
      // 需要上传的文件file
      formData.append('file', params.file, filename)
      this.formData = formData
      this.upload()
    },

    // 设置图片参数
    setParams() {
      const params = this.params
      // 设置请求参数
      const formData = new FormData()
      // 文件时间戳
      const date = Date.parse(new Date())
      // 文件名
      const filename = `${this.path + date}.${this.fileType.split('/')[1]}`
      this.filename = filename
      // 文件名字，可设置路径
      formData.append('key', `${filename}`)
      // policy规定了请求的表单域的合法性
      formData.append('policy', params.policy)
      // Bucket 拥有者的Access Key Id
      formData.append('OSSAccessKeyId', params.accessid)
      // 让服务端返回200,不然，默认会返回204
      formData.append('success_action_status', '200')
      // 根据Access Key Secret和policy计算的签名信息，OSS验证该签名信息从而验证该Post请求的合法性
      // formData.append("callback", params.callback);
      formData.append('signature', params.signature)
      formData.append('name', filename)
      // 需要上传的文件file
      formData.append('file', params.file, filename)
      this.formData = formData
      this.upload()
    },
    // 上传图片文件
    async upload() {
      try {
        const res = await axios.post(this.host, this.formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        const data = res.request.responseURL + this.filename
        window.tinymce
          .get(this.tinymceId)
          .insertContent(`<img style="max-width:100%;" src="${data}">`)
        this.$emit('subUploadSucceed', data)
      } catch (error) {
        console.log(error, 'upload->err')
      }
    }
  }
}
</script>

<style lang='scss'>
.tinymce-container {
  position: relative;
}
.tinymce-container >>> .mce-fullscreen {
  z-index: 10000;
}
.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}
.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 4px;
  /*z-index: 2005;*/
}
.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}
.editor-upload-btn {
  display: inline-block;
}
// 隐藏底部logo栏
.mce-edit-area + .mce-statusbar {
  opacity: 0;
  height: 0;
}
</style>
