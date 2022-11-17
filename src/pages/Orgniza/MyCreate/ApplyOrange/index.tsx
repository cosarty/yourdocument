import { applyOrg } from '@/services/organize';

import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import type { FC } from 'react';

const ApplyOrange: FC = () => {
  const submit = async (value: { flag: string }) => {
    const { code, message: msg } = await applyOrg(value.flag);

    if (code === 200) {
      message.success(msg);
    }
    return code === 200;
  };
  return (
    <ModalForm<{ flag: string }>
      title={'申请组织'}
      trigger={<Button style={{ marginRight: 10 }}>申请组织</Button>}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        width: 400,
      }}
      onFinish={submit}
    >
      <ProFormText
        name='flag'
        label='邀请码'
        rules={[
          { required: true, message: '请输入邀请码' },
          { max: 9, min: 9, message: '请输入六位邀请码' },
        ]}
        placeholder='请输入邀请码'
      />
    </ModalForm>
  );
};

export default ApplyOrange;
