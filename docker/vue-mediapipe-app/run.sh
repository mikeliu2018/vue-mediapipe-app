#!/bin/sh

# 進入道專案目錄中
cd /usr/src/app

# 更新套件
npm update
# npm update --legacy-peer-deps
wait

# 重新 compile Nuxt 專案並啟動
# npm run build
# wait
# npm run start

# 上面也可以改為 
npm run serve