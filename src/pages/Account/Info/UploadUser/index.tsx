/* eslint-disable no-param-reassign */
import UploadImag from '@/components/UploadImag';
import { updateUser } from '@/services/users';
import { pick } from '@/util/utils';
import { MailOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ModalForm,
  ProForm,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, message, Skeleton } from 'antd';
import { useRef } from 'react';
import styles from './index.less';
interface FormField {
  avtar_url?: string;
  email?: string;
  nickname: string;
  gender: number;
  profile: string;
}

export default () => {
  const { initialState } = useModel('@@initialState');
  const { getUser } = useModel('user');

  const formRef = useRef<ProFormInstance>();

  // tslint:disable-next-line: no-non-null-assertion
  const setValue = (name: string, value: string | number) =>
    formRef.current?.setFieldsValue({ [name]: value });

  const submit = async (values: FormField) => {
    values = pick(values, ['email', 'avtar_url'], true);
    await updateUser(values);
    await getUser();
    message.success('编辑成功');
    return true;
  };

  return initialState?.currentUser ? (
    <ModalForm<any>
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
      onFinish={submit}
      request={async () => {
        return initialState?.currentUser ?? undefined;
      }}
    >
      <div className={styles['form_position']}>
        <ProForm.Item
          rules={[{ required: true, message: '请上传图片' }]}
          name='avtar_url'
          style={{ alignSelf: 'center' }}
        >
          <UploadImag
            onChange={(v: string) => {
              setValue('avtar_url', v);
            }}
            value={initialState?.currentUser?.avtar_url}
          />
        </ProForm.Item>
        <ProFormText
          readonly
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
        <ProFormTextArea name='profile' placeholder='请输入简介' fieldProps={{ rows: 4 }} />
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
  ) : (
    <Skeleton />
  );
};
