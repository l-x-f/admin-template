import {
  Bucket,
  Region,
  cos
} from "@/utils/cos";
import { isInArray } from "@/utils/index";

// import {
//   Message
// } from 'element-ui';
// import lrz from 'lrz'
// 图片上传参数配置
const uploadConfig = {
  action: '', // 必填参数 图片上传地址
  methods: 'POST', // 必填参数 图片上传方式
  token: sessionStorage.token, // 可选参数 如果需要token验证，假设你的token有存放在sessionStorage
  name: 'img', // 必填参数 文件的参数名
  size: 1024 * 5, // 可选参数   图片大小，单位为Kb, 1M = 1024Kb
  accept: 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon' // 可选 可上传的图片格式
}

// toolbar工具栏的工具选项（默认展示全部）
const toolOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  // ['blockquote', 'code-block'],
  [{
    'align': []
  }],
  [{
    'header': 1
  }, {
    'header': 2
  }],
  // [{
  //   'list': 'ordered'
  // }, {
  //   'list': 'bullet'
  // }],
  // [{
  //   'script': 'sub'
  // }, {
  //   'script': 'super'
  // }],
  [{
    'indent': '-1'
  }, {
    'indent': '+1'
  }],
  // [{
  //   'direction': 'rtl'
  // }],
  // [{
  //   'size': ['small', false, 'large', 'huge']
  // }],
  // [{
  //   'header': [1, 2, 3, 4, 5, 6, false]
  // }],
  [{
    'color': []
  }, {
    'background': []
  }],
  // [{
  //   'font': []
  // }],

  // ['clean'],
  // ['link', 'image', 'video']
  ['link', 'image']
]

// handler重写事件, 任何工具按钮的功能都可以重写，这里只重写图片上传事件
const handlers = {
  image: function image() {
    var self = this;
    var fileInput = this.container.querySelector('input.ql-image[type=file]');
    if (fileInput == null) {
      fileInput = document.createElement('input');
      fileInput.setAttribute('type', 'file');
      // 设置图片参数名
      if (uploadConfig.name) {
        fileInput.setAttribute('name', uploadConfig.name);
      }

      // 可设置上传图片的格式
      fileInput.setAttribute('accept', uploadConfig.accept);
      fileInput.classList.add('ql-image');
      // 监听选择文件
      fileInput.addEventListener('change', function () {
        // 如果图片限制大小
        // console.log(fileInput.files[0])
        if (uploadConfig.size && fileInput.files[0].size >= uploadConfig.size * 1024) {
          fileInput.value = ''
          window.ELEMENT.Message({
            message: "上传图片的尺寸最大不能超过5M!",
            type: 'error',
            duration: 3 * 1000
          })
          return
        }
        // 图片限制类型
        let accept = ['image/png', 'image/gif', 'image/jpeg', 'image/bmp', 'image/x-icon'];
        // console.log(accept,fileInput.files[0])
        if (!isInArray(accept,fileInput.files[0].type)) {         
          window.ELEMENT.Message({
            message: "上传图片格式不正确",
            type: 'error',
            duration: 3 * 1000
          })
          return
        }
        // 上传
        //  图片压缩处理
        // lrz(fileInput.files[0], {
        //   // 图片质量
        //   quality: 1
        // }).then(res => {
          // console.log(res, 'lrzres')
          // cos图片上传
          cos.sliceUploadFile({
              Bucket: Bucket,
              Region: Region,
              Key: getUploadPathTimestamp(fileInput.files[0].name),
              Body: res.file
            },
            (err, data) => {
              if (!err) {
                // console.log(data, 'cosdata')
                // 把成功后的url插入组件
                var length = self.quill.getSelection(true).index;
                self.quill.insertEmbed(length, 'image', "https://" + data.Location);
                self.quill.setSelection(length + 1);
              } else {
                // console.log(err, 'coserr')
              }
            }
          );
        // }).catch(err => {
        //   // console.log('图片压缩失败' + err)
        // })


      });
      this.container.appendChild(fileInput);


    }
    fileInput.click();
  }
}

// 设置上传路径
// var uploadPath = '';
// export function setUploadPath(path) {
//   uploadPath = 'pc' + path;
// }

// 全部配置
export const editorOptions = {
  placeholder: '请输入内容',
  theme: 'snow', // 主题
  modules: {
    toolbar: {
      container: toolOptions, // 工具栏选项
      handlers: handlers // 事件重写
    }
  },
  ops: [{
      insert: 'Gandalf',
      attributes: {
        bold: true
      }
    },
    {
      insert: ' the '
    },
    {
      insert: 'Grey',
      attributes: {
        color: '#cccccc'
      }
    }
  ]
}

// 文件时间戳 eg.20180103.bmp
export function getUploadPathTimestamp(fileName, suffix) {
  // 文件名字
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  var time = date.toTimeString();
  time = time.substr(0, 8);
  time = time.replace(/:/g, "");
  // 后缀
  if (suffix) {
    suffix = '.' + suffix;
  } else {
    const pos = fileName.lastIndexOf(".");
    suffix = fileName.substr(pos, fileName.length - pos);
  }
  return 'pc' + "/" + year + (month < 10 ? '0' + month : String(month)) + (day < 10 ? '0' + day : String(day)) + time + suffix;
}
