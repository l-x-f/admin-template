
<template>
  <div>
    <el-dialog
      title="图片裁剪"
      :visible.sync="showCropper"
      top="6vh"
      width="50%"
      height="600"
      class="cropper-dialog"
      center
    >
      <vueCropper
        v-show="showCropper"
        :class="{'corpper-warp':showCropper}"
        id="corpper"
        ref="cropper"
        :img="cropper.img"
        :outputSize="cropper.size"
        :canMove="cropper.canMove"
        :outputType="cropper.outputType"
        :info="cropper.info"
        :canScale="cropper.canScale"
        :autoCrop="cropper.autoCrop"
        :autoCropWidth="cropper.autoCropWidth"
        :autoCropHeight="cropper.autoCropHeight"
        :fixed="cropper.fixed"
        :fixedNumber="cropper.fixedNumber"
        :fixedBox="cropper.fixedBox"
        :canMoveBox="cropper.canMoveBox"
        :original="cropper.original"
        :full="cropper.full"
      ></vueCropper>
      <div v-if="showCropper" class="cropper-button">
        <el-button size="small" @click.native="showCropper=false">取消</el-button>
        <el-button size="small" type="primary" @click="uploadCropper">完成</el-button>
      </div>
    </el-dialog>
    <input
      v-if="isNeedCropper"
      type="file"
      :id="id"
      style="display: none"
      name="single"
      :accept="accept"
      @change="selectedFileCropper"
    >
    <input
      v-if="!isNeedCropper"
      type="file"
      :id="id"
      style="display: none"
      name="single"
      :accept="accept"
      @change="selectedFile"
    >
    <el-button :size="buttonSize" type="primary" :loading="loading" @click="handleOpenFile()">
      <i class="fa fa-upload"></i>
      {{buttonName}}
    </el-button>
    <div v-if="isShowTips" class="el-upload__tip clear-margin-top">{{tips}}</div>
  </div>
</template>

<script>
import { getAuthorization } from "@/api/upload";
import { VueCropper } from "vue-cropper";
import axios from "axios";
export default {
  components: { VueCropper },
  props: {
    // 是否显示提示
    isShowTips: {
      type: Boolean,
      default: false
    },
    // 是否需要裁剪
    isNeedCropper: {
      type: Boolean,
      default: true
    },
    // 只能上传图片文件
    isImageFile: {
      type: Boolean,
      default: false
    },
    // 最大上传文件的大小
    maxFileSize: {
      type: Number,
      default: 2
    },
    // 提示内容
    tips: {
      type: String,
      default: "只能上传jpg/png文件，且不超过500kb"
    },
    // 图片比列
    fixedNumber: {
      type: Array,
      default: function() {
        return [1, 1];
      }
    },
    // 图片文件分辨率的宽度
    width: {
      type: Number,
      width: 0
    },
    // 图片文件分辨率的高度
    height: {
      type: Number,
      default: 0
    },
    // 按钮名称
    buttonName: {
      type: String,
      default: "点击上传"
    },
    // 文件id
    id: {
      type: [String, Number],
      default: "file-id"
    },
    // 按钮大小
    buttonSize: {
      type: String,
      default: "small"
    },
    // 上传的文件路径
    path: {
      type: String,
      default: "admin-images/"
    }
  },
  computed: {
    // 限制文件的类型
    accept: function() {
      return this.isImageFile ? "image/*" : "";
    }
  },
  data() {
    return {
      filename: null,
      params: {},
      fileData: null,
      formData: {},
      host: "",
      fileType: "",

      loading: false,
      showCropper: false,
      // 裁剪参数
      cropper: {
        img: "",
        info: true,
        // 裁剪生成图片的质量0.1-1
        size: 0.9,
        outputType: "jpeg",
        canScale: true,
        autoCrop: true,
        full: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: this.width,
        autoCropHeight: this.height,
        fixedBox: false,
        // 开启宽度和高度比例
        fixed: true,
        fixedNumber: this.fixedNumber,
        original: false,
        canMoveBox: true,
        canMove: true
      }
    };
  },
  created() {
    // this.getOssData();
  },
  methods: {
    // 打开文件
    handleOpenFile() {
      let input = document.getElementById(this.id);
      input.addEventListener(
        "click",
        function() {
          // 解决同一个文件不能监听的问题
          this.value = "";
        },
        false
      );
      // 点击input
      input.click();
    },
    // 弹出message
    toastMessage(message) {
      this.$message.error(message);
      this.loading = false;
    },
    // 裁剪监听文件上传
    selectedFileCropper(e) {
      this.showCropper = true;
      const file = e.target.files[0];
      const reader = new FileReader();
      this.fileType = file.type;
      reader.onload = e => {
        let data;
        if (typeof e.target.result == "object") {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }
        this.cropper.img = "";
        this.cropper.img = data;
      };
      // 转化为base64
      // reader.readAsDataURL(file)
      // 转化为blob
      reader.readAsArrayBuffer(file);
    },
    // 裁剪上传
    uploadCropper() {
      this.$refs.cropper.getCropBlob(imgRes => {
        this.uploadTip = "正在上传";
        this.showUploadLoading = true;
        this.params.file = imgRes;
        // console.log(imgRes, "imgRes");
        const isMaxSize = imgRes.size / 1024 / 1024 < this.maxFileSize;
        if (!isMaxSize) {
          this.toastMessage(
            "上传头像图片大小不能超过 " + this.maxFileSize + "MB!"
          );
          return;
        }
        this.getOssData();
      });
    },
    // 判断图片文件的分辨率是否在限定范围
    isAppropriateResolution(file, width, height) {
      // 读取图片数据
      var reader = new FileReader();
      var self = this;
      reader.onload = function(e) {
        var data = e.target.result;
        // 加载图片获取图片真实宽度和高度
        var image = new Image();
        image.onload = function() {
          if (image.width !== width || image.height !== height) {
            self.toastMessage("上传图片的分辨率必须为" + width + "*" + height);
          } else {
            self.getOssData();
          }
        };
        image.src = data;
      };
      reader.readAsDataURL(file);
    },
    // 获取服务端传递过来的阿里oss签名
    async getOssData() {
      try {
        let res = await getAuthorization();
        this.params = { ...this.params, ...res };
        this.host = "https://" + res.host;
        this.setParams();
      } catch (error) {
        console.log(error);
      }
    },
    // 不带裁剪的选择文件
    selectedFile(e) {
      let file = e.target.files[0];
      this.fileData = file;
      this.params.file = file;
      this.fileType = this.params.file.type;
      const isMaxSize = file.size / 1024 / 1024 < this.maxFileSize;
      if (!isMaxSize) {
        this.toastMessage(
          "上传头像图片大小不能超过 " + this.maxFileSize + "MB!"
        );
        return;
      }
      if (this.width !== 0 && this.height !== 0) {
        this.isAppropriateResolution(this.fileData, this.width, this.height);
      } else {
        this.getOssData();
      }
    },
    // 设置参数
    setParams() {
      const params = this.params;
      // 设置请求参数
      const formData = new FormData();
      // 文件时间戳
      const date = Date.parse(new Date());
      // 文件名
      const filename = `${this.path + date}.${this.fileType.split("/")[1]}`;
      this.filename = filename;
      // 文件名字，可设置路径
      formData.append("key", `${filename}`);
      // policy规定了请求的表单域的合法性
      formData.append("policy", params.policy);
      // Bucket 拥有者的Access Key Id
      formData.append("OSSAccessKeyId", params.accessid);
      // 让服务端返回200,不然，默认会返回204
      formData.append("success_action_status", "200");
      // 根据Access Key Secret和policy计算的签名信息，OSS验证该签名信息从而验证该Post请求的合法性
      // formData.append("callback", params.callback);
      formData.append("signature", params.signature);
      formData.append("name", filename);
      // 需要上传的文件file
      formData.append("file", params.file, filename);
      this.formData = formData;
      this.upload();
    },
    // 上传文件
    async upload() {
      try {
        let res = await axios.post(this.host, this.formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        let data = res.request.responseURL + this.filename;
        this.$emit("subUploadSucceed", data);
        console.log(data, "upload-res");
      } catch (error) {
        console.log(err, "upload->err");
      }
      this.showCropper = false;
    }
  }
};
</script>

<style lang="scss"  scoped >
.clear-margin-top {
  margin-top: 0;
}
.cropper-dialog {
  height: 800px;
  text-align: center;
  .el-dialog__header {
    padding-top: 15px;
  }
  .el-dialog--center .el-dialog__body {
    padding-top: 0;
    padding-bottom: 15px;
  }
  .el-dialog {
    text-align: center;
  }
}

#corpper {
  width: 90%;
  height: 400px;
  margin: 0 auto;

  background-image: none;
  background: #fff;

  z-index: 1002;
}

.cropper-button {
  z-index: 1003;

  text-align: center;
  margin-top: 20px;
  .el-button {
    color: #fff;
    font-size: 16px;

    cursor: pointer;
    text-align: center;
    color: #373737;
  }

  .el-button:last-child {
    margin-left: 100px;
  }
}
.cropper-modal {
  background-color: rgba(0, 0, 0, 0.5) !important;
}
</style>
