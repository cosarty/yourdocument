import Logo from '@/assets/shitijun.png';
import Footer from '@/components/Footer';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { ProFormCaptcha } from '@ant-design/pro-components';
import { LoginForm, ProFormText } from '@ant-design/pro-form';
import { Image, message, Tabs } from 'antd';
import { useState } from 'react';
import { SelectLang, useModel } from 'umi';
import styles from './index.less';

type LoginType = 'login' | 'register';

const Login = () => {
  const [loginType, setLoginType] = useState<LoginType>('login');
  const { login } = useModel('user');

  const handleSubmit = async (values: any) => {
    await login(values);
  };

  return (
    <div className={styles.container}>
      <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang />}
      </div>
      <div className={styles.content}>
        <LoginForm
          logo={<Image alt='logo' src={Logo} />}
          title='试题君'
          subTitle={'欢迎登录'}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values);
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
                  prefix: <UserOutlined className={styles.prefixIcon} />,
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
                name='email'
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'邮箱:super@a.com'}
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
                placeholder={'密码：123123'}
                rules={[
                  {
                    required: true,
                    message: '请输入密码！',
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
                  message.success('获取验证码成功！验证码为：1234');
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
