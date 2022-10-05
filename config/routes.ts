export default [
  {
    title: '登录',
    path: '/login',
    component: '@/pages/Login',
    layout: false,
  },
  {
    path: '/',
    name: '题目',
    icon: 'smile',
    component: '@/pages/Home',
    exact: true,
  },
  {
    path: '/account',
    name: '个人',
    icon: 'UserOutlined',
    access: 'canLogin',
    routes: [
      {
        path: '/account',
        redirect: '/account/info',
      },
      {
        name: '个人资料',
        path: '/account/info',
        component: '@/pages/Account/Info',
        icon: 'UserOutlined',
      },
      {
        name: '我的收藏',
        path: '/account/Favour',
        component: '@/pages/Account/Favour',
        icon: 'StarOutlined',
      },
      {
        name: '我的题目',
        path: '/account/question',
        component: '@/pages/Account/Questions',
        icon: 'FileOutlined',
      },
      {
        name: '我的回答',
        path: '/account/comment',
        component: '@/pages/Account/Comment',
        icon: 'MessageOutlined',
      },
      {
        name: '消息通知',
        path: '/account/message',
        component: '@/pages/Account/Message',
        icon: 'BellOutlined',
      },
      {
        name: '错题本',
        path: '/account/mistakes',
        component: '@/pages/Account/Mistakes',
        icon: 'CodeOutlined',
      },
      {
        name: '我的试卷',
        path: '/account/mypaper',
        component: '@/pages/Account/Paper',
        icon: 'CodeOutlined',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/vieworgani',
    component: '@/pages/Vieworgani',
    // wrappers: ['@/wrappers/authVieworgani'],
    layout: false,
  },
  {
    path: '/organi',
    name: '组织',
    access: 'canLogin',
    component: '@/pages/Orgniza',
  },
  {
    path: '/manage',
    access: 'canAdmin',
    name: '管理员界面',
    icon: 'AppstoreAddOutlined',
    routes: [
      {
        path: '/manage',
        redirect: '/manage/question',
      },
      {
        name: '题目管理',
        path: '/manage/question',
        component: '@/pages/Mange/Question',
        icon: 'ContainerOutlined',
      },

      {
        name: '人员管理',
        path: '/manage/users',
        component: '@/pages/Mange/User',
        icon: 'UsergroupAddOutlined',
      },
      {
        name: '分类管理',
        path: '/manage/classtify',
        component: '@/pages/Mange/Tags',
        access: 'canSuper',
        icon: 'MacCommandOutlined',
      },
      {
        component: './404',
      },
    ],
  },

  {
    component: './404',
  },
  {
    path: '/addQuestion',
    access: 'canLogin',
    component: '@/pages/AddQuestion',
    hideMenu: true,
  },
  {
    path: '/editQuestion/:questionId',
    wrappers: ['@/wrappers/authEditQuestion'],
    component: '@/pages/AddQuestion',
    hideMenu: true,
  },
  {
    path: '/qd/:questionId',
    component: '@/pages/QuestionDetail',
    hideMenu: true,
    // target: '_blank'
  },
];
