export default [
  {
    name: 'login',
    path: '/login',
    component: '@/pages/Login',
    menu: false
  },
  {
    path: '/',
    name: '题目',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/account',
    name: '个人中心',

    icon: 'CodeOutlined',
    // access: 'canUser',
    routes: [
      {
        path: '/account',
        redirect: '/account/info',
        icon: 'CodeOutlined',
      },
      {
        name: '个人资料',
        path: '/account/info',
        component: './Welcome',
        icon: 'CodeOutlined',
      },
      {
        name: '我的收藏',
        path: '/account/favour',
        component: './Welcome',
        icon: 'CodeOutlined',
      },
      {
        name: '我的题目',
        path: '/account/question',
        component: './Welcome',
        icon: 'CodeOutlined',
      },
      {
        name: '我的回答',
        path: '/account/comment',
        component: './Welcome',
        icon: 'CodeOutlined',
      },
      {
        name: '消息通知',
        path: '/account/message',
        component: './Welcome',
        icon: 'CodeOutlined',
      },
      {
        name: '错题本',
        path: '/account/mistakes',
        component: './Welcome',
        icon: 'CodeOutlined',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/organi',
    name: '组织',
    routes: [
      {
        name: '我的组织',
        path: '/organi/my',
        component: './Welcome',
        icon: 'CodeOutlined',
      },
      {
        name: '我的试卷',
        path: '/organi/paper',
        component: './Welcome',
        icon: 'CodeOutlined',
      },
    ],
  },
  {
    path: '/manage',
    // access: 'canAdmin',
    name: '管理员界面',
    routes: [
      {
        path: '/manage',
        redirect: '/manage/question',
      },
      {
        name: '题目管理',
        path: '/manage/question',
        component: './Welcome',
        icon: 'CodeOutlined',
      },

      {
        name: '人员管理',
        path: '/manage/users',
        component: './Welcome',
        icon: 'CodeOutlined',
      },
      {
        name: '分类管理',
        path: '/manage/classtify',
        component: './Welcome',
        icon: 'CodeOutlined',
      },

      {
        name: '审核',
        path: '/manage/checkquestion',
        component: './Welcome',
        icon: 'CodeOutlined',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/question/:key',
    icon: 'CodeOutlined',
    component: './Welcome',
  },
  {
    component: './404',
  },
];
