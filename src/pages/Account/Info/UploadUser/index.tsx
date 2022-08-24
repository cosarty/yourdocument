import { LockOutlined, MailOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { ModalForm, ProFormRadio, ProFormText } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, message } from 'antd';

import styles from './index.less';
const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export default () => {
  const { initialState } = useModel('@@initialState');
  console.log('initialState: ', initialState?.currentUser);
  return (
    <ModalForm<{
      name: string;
      company: string;
    }>
      title='编辑'
      trigger={
        <Button type='primary'>
          <PlusOutlined />
          编辑
        </Button>
      }
      autoFocusFirstInput
      modalProps={{
        onCancel: () => console.log('run'),
        destroyOnClose: true,
        width: 400,
      }}
      submitTimeout={2000}
      onFinish={async (values) => {
        await waitTime(2000);
        console.log(values.name);
        message.success('提交成功');
        return true;
      }}
    >
      <div className={styles['.form_position ']}>
        <ProFormText
          name={'nickname'}
          fieldProps={{
            size: 'large',
            prefix: <UserOutlined />,
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
            prefix: <MailOutlined />,
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
            prefix: <LockOutlined />,
          }}
          placeholder={'请输入密码'}
          rules={[
            {
              required: true,
              message: '请输入密码！',
            },
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
      </div>
    </ModalForm>
  );
};
