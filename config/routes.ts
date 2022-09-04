﻿export default [
  {
    title: '登录',
    path: '/login',
    component: '@/pages/Login',
    layout: false
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
        icon: 'CodeOutlined',
      },
      {
        name: '我的收藏',
        path: '/account/Favour',
        component: '@/pages/Account/Favour',
        icon: 'CodeOutlined',
      },
      {
        name: '我的题目',
        path: '/account/question',
        component: '@/pages/Account/Questions',
        icon: 'CodeOutlined',
      },
      {
        name: '我的回答',
        path: '/account/comment',
        component: '@/pages/Account/Comment',
        icon: 'CodeOutlined',
      },
      {
        name: '消息通知',
        path: '/account/message',
        component: '@/pages/Account/Message',
        icon: 'CodeOutlined',
      },
      // {
      //   name: '错题本',
      //   path: '/account/mistakes',
      //   component: './Welcome',
      //   icon: 'CodeOutlined',
      // },
      {
        component: './404',
      },
    ],
  },
  /*   {
      path: '/organi',
      name: '组织',
      access: 'canLogin',
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
    }, */
  {
    path: '/manage',
    access: 'canAdmin',
    name: '管理员界面',
    routes: [
      {
        path: '/manage',
        redirect: '/manage/question',
      },
      {
        name: '题目管理',
        path: '/manage/question',
        component: '@/pages/Mange/Question',
        icon: 'CodeOutlined',
      },

      {
        name: '人员管理',
        path: '/manage/users',
        component: '@/pages/Mange/User',
        icon: 'CodeOutlined',
      },
      {
        name: '分类管理',
        path: '/manage/classtify',
        component: '@/pages/Mange/Tags',
        access: 'canSuper',
        icon: 'CodeOutlined',
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
    hideMenu: true
  },
  {
    path: '/editQuestion/:questionId',
    wrappers: [
      '@/wrappers/authEditQuestion',
    ],
    component: '@/pages/AddQuestion',
    hideMenu: true
  },
  {
    path: '/qd/:questionId',
    component: '@/pages/QuestionDetail',
    hideMenu: true,
    target: '_blank'
  },
];
