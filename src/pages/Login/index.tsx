import Logo from '@/assets/shitijun.png';
import Footer from '@/components/Footer';
import { sendMail } from '@/services/users';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { ProFormCaptcha, ProFormInstance, ProFormRadio } from '@ant-design/pro-components';
import { LoginForm, ProFormText } from '@ant-design/pro-form';
import { Image, message, Tabs } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { SelectLang, useModel } from 'umi';
import styles from './index.less';

type LoginType = 'login' | 'register';

const Login = () => {
  const [loginType, setLoginType] = useState<LoginType>('login');
  const { login, register } = useModel('user');
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    document.title = loginType === 'login' ? '登录' : '注册';
  }, [loginType]);

  const handleSubmit = async (values: any) => {
    if (loginType === 'login') {
      await login(values);
      message.success('登录成功!!!');
    }
    if (loginType === 'register') {
      console.log('values: ', values);
      if (await register(values)) {
        message.success('注册成功');
        setLoginType('login');
      } else {
        message.error('注册失败');
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang />}
      </div>
      <div className={styles.content}>
        <LoginForm
          logo={<Image alt='logo' src={Logo} />}
          formRef={formRef}
          title='试题君'
          subTitle={'欢迎登录'}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values);
          }}
          submitter={{
            // 配置按钮文本
            searchConfig: {
              submitText: loginType === 'login' ? '登录' : '注册',
            },
          }}
        >
          <Tabs
            activeKey={loginType}
            onChange={(activeKey) => setLoginType(activeKey as LoginType)}
            destroyInactiveTabPane
          >
            <Tabs.TabPane key={'login'} tab={'用户登录'} />
            <Tabs.TabPane key={'register'} tab={'用户注册'} />
          </Tabs>
          {/* {status === 'error' && <LoginMessage content={'账户或密码错误(admin/ant.design)'} />} */}
          {loginType === 'login' && (
            <>
              <ProFormText
                name='email'
                fieldProps={{
                  size: 'large',
                  prefix: <MailOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'请输入邮箱'}
                rules={[
                  {
                    required: true,
                    message: '请输入邮箱!',
                  },
                  {
                    type: 'email',
                    message: '邮箱格式错误',
                  },
                ]}
              />

              <ProFormText.Password
                name='password'
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'请输入密码'}
                rules={[
                  {
                    required: true,
                    message: '请输入密码！',
                  },
                ]}
              />
            </>
          )}
          {loginType === 'register' && (
            <>
              <ProFormText
                name={'nickname'}
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'请输入昵称'}
                rules={[
                  {
                    required: true,
                    message: '请输入昵称!',
                  },
                ]}
              />
              <ProFormText
                name='email'
                fieldProps={{
                  size: 'large',
                  prefix: <MailOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'请输入邮箱'}
                rules={[
                  {
                    required: true,
                    message: '请输入邮箱!',
                  },
                  {
                    type: 'email',
                    message: '邮箱格式错误',
                  },
                ]}
              />

              <ProFormText.Password
                name='password'
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'请输入密码'}
                rules={[
                  {
                    required: true,
                    message: '请输入密码！',
                  },
                ]}
              />
              <ProFormText.Password
                name='confirm'
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                // dependencies={['password']}
                placeholder={'请确认密码'}
                rules={[
                  {
                    required: true,
                    message: '请确认密码！',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次密码不一致'));
                    },
                  }),
                ]}
              />
              <ProFormRadio.Group
                name='gender'
                options={[
                  {
                    label: '女',
                    value: 1,
                  },
                  {
                    label: '男',
                    value: 0,
                  },
                ]}
                rules={[
                  {
                    required: true,
                    message: '请选择性别',
                  },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={'prefixIcon'} />,
                }}
                captchaProps={{
                  size: 'large',
                }}
                placeholder={'请输入验证码'}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${'获取验证码'}`;
                  }
                  return '获取验证码';
                }}
                name='captcha'
                rules={[
                  {
                    required: true,
                    message: '请输入验证码！',
                  },
                ]}
                countDown={60}
                onGetCaptcha={async () => {
                  const email = formRef?.current?.getFieldValue('email') as string;
                  const state = await sendMail({ email });
                  message.success('获取验证码成功！');
                  console.log('state: ', state);
                }}
              />
            </>
          )}
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
