import Vue from 'vue'
import VueRouter from 'vue-router'
import Recommend from '@/components/recommend/recommend';
import Singer from '@/components/singer/singer';
import Rank from '@/components/rank/rank';
import Search from '@/components/search/search';
import SingerDetail from '@/components/singer-detail/singer-detail';
import Disc from '@/components/disc/disc';
import TopList from '@/components/top-list/top-list';

Vue.use(VueRouter)

const routes = [
  // 根路径，选中状态
  {
    path: '/',
    redirect: '/recommend',
  },
  {
    path: '/recommend',
    component: Recommend,
    children: [
      {
        path: ':id',
        component: Disc
      }
    ]
  },
  {
    path: '/singer',
    component: Singer,
    children: [
      {
        path: ':id',
        component: SingerDetail
      }
    ]
  },
  {
    path: '/rank',
    component: Rank,
    children: [
      {
        path: ':id',
        component: TopList
      }
    ]
  },
  {
    path: '/search',
    component: Search
  },

  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
