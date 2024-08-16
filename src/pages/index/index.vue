<script setup lang="ts">
import { getHomeBannerAPT, getHomeCategoryAPI, getHomeHotAPI } from '@/services/home'
import type { BannerItem, CategoryItem, HotItem } from '@/types/home'
import { useGuessList } from '@/composables/index'
import { onLoad } from '@dcloudio/uni-app'
import { ref, reactive } from 'vue'
import CustomNavbar from './componets/CustomNavbar.vue'
import CategoryPanel from './componets/CategoryPanel.vue'
import HotPanel from './componets/HotPanel.vue'
import pageSkeleton from './componets/pageSkeleton.vue'
const bannerList = ref<BannerItem[]>([])
// 获取轮播图数据
const getHomeBannerdata = async () => {
  const res = await getHomeBannerAPT()
  bannerList.value = res.result
}
// 获取前台分类数据
const category = ref<CategoryItem[]>([])
const getHomeCategorydata = async () => {
  const res = await getHomeCategoryAPI()
  category.value = res.result
}
// 获取热门推荐
// // const hot = ref<HotItem[]>([])
// let hot = reactive<HotItem[]>([])
// const getHomeHotdata = async () => {
//   const res = await getHomeHotAPI()
//   hot = res.result;
//   console.log(res, 'res123')
// }
const hot = ref<HotItem[]>([])
const getHomeHotdata = async () => {
  const res = await getHomeHotAPI()
  hot.value = res.result
  console.log(res, 'res123')
}
// 是否加载中标记
const isLoding = ref(false)
// 页面加载
onLoad(async () => {
  isLoding.value = true
  Promise.all([await getHomeBannerdata(), getHomeCategorydata(), getHomeHotdata()])
  isLoding.value = false
})

//滚动触底的时候在调用猜你喜欢的数据，获取猜你喜欢的组件实例实例
// 猜你喜欢组合式函数
const { guessRef, onScrolltolower } = useGuessList()
const istriggered = ref(false)
// 监听下拉刷新
const onrefresherrefresh = async () => {
  // 开始动画
  istriggered.value = true
  // getHomeBannerdata()
  // getHomeCategorydata()
  // getHomeHotdata()
  // 调用猜你喜欢组件的方法，重置数据
  guessRef.value?.resetData()
  await Promise.all([
    getHomeBannerdata(),
    getHomeCategorydata(),
    getHomeHotdata(),
    guessRef.value?.getMore(),
  ])
  // 关闭下拉动画
  istriggered.value = false
}
</script>
<template>
  <!--自定义导航栏  -->
  <CustomNavbar />
  <!--
    refresher-enabled 增加下拉刷新的动画
    scrolltolower 滚动到底触发的事件
  -->
  <scroll-view
    refresher-enabled
    @refresherrefresh="onrefresherrefresh"
    @scrolltolower="onScrolltolower"
    scroll-y
    :refresher-triggered="istriggered"
    class="scroll-view"
  >
    <pageSkeleton v-if="true" />
    <template v-else>
      <!-- 自定义轮播图 -->
      <XtxSwiper :list="bannerList" />
      <!-- 分类组件 -->
      <CategoryPanel :list="category" />
      <!-- 热门推荐 -->
      <HotPanel :list="hot" />
      <!--猜你喜欢 自动导入会没有限制类型得重新给组件指定类型-->
      <XtxGuess ref="guessRef" />
    </template>
  </scroll-view>
</template>
<style lang="scss">
//  改变首页的底部颜色,小程序里的底色样式是page
/* #ifdef APP-PLUS */
#app,
/* #endif */
page {
  background-color: #f7f7f7;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.scroll-view {
  flex: 1;
}
</style>
