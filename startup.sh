#!/bin/bash

CUR_DIR=$(pwd)
WWW="$CUR_DIR/www"

green() {
    echo -e "\033[;32m${1}\033[0m"
}

green "依赖安装开始"
npm install --registry=https://r.npm.taobao.org >/dev/null
green "依赖安装完成"

green "前端部分安装开始"
git clone -b www git@github.com:CloudWise-OpenSource/FlyFish.git www

cd "$WWW/components"
npm install --registry=https://r.npm.taobao.org >/dev/null
green "前端部分安装完成"

cd ../..
npm run dev


