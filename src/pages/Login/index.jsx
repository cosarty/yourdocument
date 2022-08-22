import { LockOutlined, UserOutlined } from '@ant-design/icons';
import React from 'react';
import { ProFormText, LoginForm } from '@ant-design/pro-form';
import { SelectLang, connect, useModel } from 'umi';
import Footer from '@/components/Footer';
import Logo from '@/assets/shitijun.png';
import styles from './index.less';
import { Image } from 'antd'


const Login = (props) => {

  const handleSubmit = async (values) => {
    await ringup(values)
  };

  return (
    <div className={styles.container}>
      <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang />}
      </div>
      <div className={styles.content}>
        <LoginForm
          logo={<Image alt="logo" src={Logo} />}
          title="cxn"
          subTitle={'试题君'}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values);
          }}
        >
          {/* {status === 'error' && <LoginMessage content={'账户或密码错误(admin/ant.design)'} />} */}
          <ProFormText
            name="email"
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
            name="password"
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
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login

