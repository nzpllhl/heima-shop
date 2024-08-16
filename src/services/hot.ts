import { http } from '@/utils/http'
import type { PageParams } from '@/types/global'
import type { HotResult } from '@/types/hot'
/**
 * 通用热门推荐类型
 * @param url 请求地址
 * @param data 请求参数
 */
type HotParams = PageParams & { subType?: string }
export const getHotRecommendAPI = (url: string, data?: HotParams) => {
  return http<HotResult>({
    method: 'GET',
    url, // 不能写死，别的页面也用到的话传递不同的请求参数
    data,
  })
}