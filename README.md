
# Treex
基于 electron 和 nodegit 开发的 git 客户端。

# ScreenShot

![treex-gif-2][2]

# Features

 - 历史浏览、历史搜索
 - 工作区查看
 - 分支切换与查看
 - 标签查看
 - 贮藏(stash)
 - 远端分支下载
 - 子模块
 - 仓库克隆(目前仅支持 http)

# Installation
请移步到该项目的 [release][3] 页面。

# 当前版本支持平台

 - OSX
 - Windows(尚未发布)
 - Linux(尚未发布)

# Development

## 开发版

在项目根目录运行
````
npm run dev
````
````
npm run open:dist
````

## 打包
在项目根目录运行
````
npm run production
````
然后 cd 到 ./app/dist，使用 electron-packager 进行打包，如
````
electron-packager ./ --name=treex --version=1.1.1 --no-prune --icon=./assets/logo/treex-square.png.icns
````

# License

MIT


  [1]: https://github.com/huangruichang/treex/blob/master/app/src/assets/gif/treex-1.gif
  [2]: https://github.com/huangruichang/treex/blob/master/app/src/assets/gif/treex-2.gif
  [3]: https://github.com/huangruichang/treex/releases