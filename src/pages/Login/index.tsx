import Logo from '@/assets/shitijun.png';
import Footer from '@/components/Footer';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-form';
import { Image, Tabs } from 'antd';
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
            </>
          )}
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
