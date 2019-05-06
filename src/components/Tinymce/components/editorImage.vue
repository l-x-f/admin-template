<template>
  <div class="upload-container">
    <el-tooltip class="item" effect="dark" content="上传图片" placement="bottom" :hide-after="800">
      <el-button @click="showDialog" icon="el-icon-upload" size="mini" type="primary">上传图片</el-button>
    </el-tooltip>
    <el-dialog title="上传图片" append-to-body width="50%" :visible.sync="dialogVisible" center>
      <!-- <el-upload class="editor-slide-upload" action="https://httpbin.org/post" :multiple="false" :file-list="fileList" :show-file-list="true" list-type="picture-card" :on-remove="handleRemove" :on-success="handleSuccess" :before-upload="beforeUpload">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>-->
      <div class="img-box">
        <img class="img" :src="imgSrc" alt v-if="imgSrc">
      </div>
      <div class="uploadImg-box">
        <input
          title=" "
          class="img-input"
          type="file"
          ref="fileElem"
          name="img"
          @change="uploadImg"
        >
        <el-button class="btn" size="small" type="primary">点击上传</el-button>
      </div>

      <div class="btn-box">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { getToken } from 'api/qiniu'

export default {
  name: "editorSlideUpload",
  props: {
    color: {
      type: String,
      default: "#f4d020"
    }
  },
  data() {
    return {
      dialogVisible: false,
      imgSrc: "",
      listObj: {},
      fileList: [],
      file: null
    };
  },
  methods: {
    checkAllSuccess() {
      return Object.keys(this.listObj).every(
        item => this.listObj[item].hasSuccess
      );
    },
    showDialog() {
      this.dialogVisible = true;
      this.imgSrc = "";
    },
    handleSubmit() {
      // const arr = Object.keys(this.listObj).map(v => this.listObj[v]);
      // if (!this.checkAllSuccess()) {
      //   this.$message(
      //     "请等待所有图片上传成功 或 出现了网络问题，请刷新页面重新上传！"
      //   );
      //   return;
      // }
      // console.log(arr);
      this.$emit("success", { urlData: this.imgSrc, file: this.file });
      // this.listObj = {};
      // this.fileList = [];
      this.dialogVisible = false;
    },
    handleSuccess(response, file) {
      const uid = file.uid;
      const objKeyArr = Object.keys(this.listObj);
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          this.listObj[objKeyArr[i]].url = response.files.file;
          this.listObj[objKeyArr[i]].hasSuccess = true;
          return;
        }
      }
    },
    handleRemove(file) {
      const uid = file.uid;
      const objKeyArr = Object.keys(this.listObj);
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]];
          return;
        }
      }
    },
    beforeUpload(file) {
      const _self = this;
      const _URL = window.URL || window.webkitURL;
      const fileName = file.uid;
      this.listObj[fileName] = {};
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = _URL.createObjectURL(file);
        img.onload = function() {
          _self.listObj[fileName] = {
            hasSuccess: false,
            uid: file.uid,
            width: this.width,
            height: this.height
          };
        };
        resolve(true);
      });
    },
    uploadImg() {
      // let img = this.$refs.imgAvatar;
      //console.log(fileElem)
      let files = this.$refs.fileElem.files;
      this.file = files[0];
      console.log(this.file, "file");
      let reader = new FileReader();
      let that = this;
      if (files[0].size > 1024 * 1024 * 5) {
        this.$message({
          message: "图片不得大于5M",
          type: "warning",
          duration: 2000
        });
        return;
      }
      // console.log(files[0].size, "files[0]");
      reader.readAsDataURL(files[0]);
      reader.onload = function(e) {
        //头像上传完成回调

        // console.log(reader.result,'reader.result')
        that.imgSrc = reader.result;
        // that.$emit("successCBK", reader.result);
      };
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  /deep/ .el-upload--picture-card {
    width: 100%;
  }
}
.el-dialog__body {
  >>> .btn-box {
    text-align: center;
  }
}
.img-box {
  width: 100%;
  text-align: center;
  .img {
    width: 100%;
    max-width: 600px;
  }
}
.uploadImg-box {
  width: 100%;
  height: 150px;
  margin: 0 auto;

  border: 1px dashed #c0ccda;
  border-radius: 6px;
  position: relative;
  margin: 20px 0;
  &:hover {
    border: 1px dashed #409eff;
  }
  .img-input {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  .btn {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
