<script setup lang="ts">
import type { BannerItem } from '@/types/home'
import { ref } from 'vue'
// 索引
const activeIndex = ref(0)
// 当swiper滑动时触发
const onChange: UniHelper.SwiperOnChange = (ev) => {
  //非空断言!空断言，主观上排除掉空值情况
  activeIndex.value = ev.detail!.current
}
//定义props接收
defineProps<{
  list: BannerItem[]
}>()
</script>
<template>
  <view class="carousel">
    <swiper :circular="true" :autoplay="false" :interval="3000" @change="onChange">
      <swiper-item v-for="item in list" :key="item.id">
        <navigator url="/pages/index/index" hover-class="none" class="navigator">
          <image mode="aspectFill" class="image" :src="item.imgUrl"></image>
        </navigator>
      </swiper-item>
    </swiper>
    <!-- 指示点 -->
    <view class="indicator">
      <text
        v-for="(item, index) in 3"
        :key="item"
        class="dot"
        :class="{ active: index === activeIndex }"
      ></text>
    </view>
  </view>
</template>

<style lang="scss">
@import '../components/styles/XtxSwiper.scss';
</style>
