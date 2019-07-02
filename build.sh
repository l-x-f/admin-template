#!/usr/bin/env bash
# 提示参数变量
fail="打包命令执行错误"
# 打包命令判断
if  [ $# = 0 ] ; then
    # 执行打包命令
    npm run build:prod
    # 上传到服务器
    
else
    # 输出错误
    echo $fail;    
fi