import UploadImag from '@/components/UploadImag';
import { LockOutlined, MailOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import type { ProFormInstance } from '@ant-design/pro-components';
import { ModalForm, ProForm, ProFormRadio, ProFormText } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, message } from 'antd';
import { useRef } from 'react';
import styles from './index.less';

export default () => {
  const { initialState } = useModel('@@initialState');
  const { getUser } = useModel('user');

  const formRef = useRef<ProFormInstance>();

  // tslint:disable-next-line: no-non-null-assertion
  const setValue = (name: string, value: string | number) =>
    formRef.current?.setFieldsValue({ [name]: value });

  return (
    <ModalForm<{
      name: string;
      company: string;
    }>
      formRef={formRef}
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
      onFinish={async () => {
        await getUser();
        // console.log(values.name);
        message.success('编辑成功');
        return true;
      }}
      initialValues={initialState?.currentUser ?? {}}
    >
      <div className={styles['.form_position ']}>
        <ProForm.Item rules={[{ required: true, message: '请上传图片' }]} name='avtar_url'>
          <UploadImag
            onChange={(v: string) => {
              setValue('avtar_url', v);
            }}
            value={initialState?.currentUser?.avtar_url}
          />
        </ProForm.Item>

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
