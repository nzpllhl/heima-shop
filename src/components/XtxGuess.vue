<script setup lang="ts">
import { getHomeGoodsGuessLikeAPI } from '@/services/home'
import type { PageParams } from '@/types/global'
import type { GuessItem } from '@/types/home'
import { ref, onMounted } from 'vue'

// 分页的参数类型Required 把可选参数变成必选参数
const pageParams: Required<PageParams> = {
  page: 1,
  pageSize: 10,
}
// 在组建自身内部获取数据,猜你喜欢的列表数据
const guessList = ref<GuessItem[]>([])
// 已结束的标记
const finish = ref(false)
const getHomeGoodsGuessLikedata = async () => {
  // 触底了就退出请求，不请求了
  if (finish.value === true) {
    return uni.showToast({
      icon: 'none',
      title: '没有更多数据！',
    })
  }
  const res = await getHomeGoodsGuessLikeAPI(pageParams)
  // guessList.value = res.result.items
  // 根据页码追加数据
  guessList.value.push(...res.result.items)
  // 页码累加(当前的页码小于也总数)
  if (pageParams.page < res.result.pages) {
    pageParams.page++
  } else {
    // 已完成
    finish.value = true
  }
}
// 重置数据
const resetData = () => {
  pageParams.pageSize = 1
  guessList.value = []
  finish.value = false
}
// 组件挂载完毕
onMounted(() => {
  getHomeGoodsGuessLikedata()
})

// 暴露属性或者方法，供给父页面调用
defineExpose({
  resetData,
  // 父页面使用getMore这个方法名
  getMore: getHomeGoodsGuessLikedata,
})
</script>
<template>
  <!-- 猜你喜欢 -->
  <view class="caption">
    <text class="text">猜你喜欢</text>
  </view>
  <view class="guess">
    <navigator
      class="guess-item"
      v-for="item in guessList"
      :key="item.id"
      :url="`/pages/goods/goods?id=4007498`"
    >
      <image class="image" mode="aspectFill" :src="item.picture"></image>
      <view class="name">{{ item.name }}</view>
      <view class="price">
        <text class="small">¥</text>
        <text>{{ item.price }}</text>
      </view>
    </navigator>
  </view>
  <view class="loading-text"> {{ finish ? '没有更多数据~' : '正在加载...' }} </view>
</template>

<style lang="scss">
:host {
  display: block;
}

/* 分类标题 */
.caption {
  display: flex;
  justify-content: center;
  line-height: 1;
  padding: 36rpx 0 40rpx;
  font-size: 32rpx;
  color: #262626;

  .text {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 28rpx 0 30rpx;

    &::before,
    &::after {
      content: '';
      width: 20rpx;
      height: 20rpx;
      background-image: url(@/static/images/bubble.png);
      background-size: contain;
      margin: 0 10rpx;
    }
  }
}

/* 猜你喜欢 */
.guess {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 20rpx;

  .guess-item {
    width: 345rpx;
    padding: 24rpx 20rpx 20rpx;
    margin-bottom: 20rpx;
    border-radius: 10rpx;
    overflow: hidden;
    background-color: #fff;
  }

  .image {
    width: 304rpx;
    height: 304rpx;
  }

  .name {
    height: 75rpx;
    margin: 10rpx 0;
    font-size: 26rpx;
    color: #262626;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .price {
    line-height: 1;
    padding-top: 4rpx;
    color: #cf4444;
    font-size: 26rpx;
  }

  .small {
    font-size: 80%;
  }
}

// 加载提示文字
.loading-text {
  text-align: center;
  font-size: 28rpx;
  color: #666;
  padding: 20rpx 0;
}
</style>
