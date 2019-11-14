import Layout from '@/layout'
// 用户模块
export const userRoutes = [
  {
    path: '/user',
    component: Layout,
    redirect: '/user/index',
    meta: {
      title: 'userManage',
      icon: 'user',
      noCache: true
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/user/index'),
        name: 'userList',
        meta: {
          title: 'userList',

          noCache: true
        }
      }
    ]
  }
]

export default userRoutes
