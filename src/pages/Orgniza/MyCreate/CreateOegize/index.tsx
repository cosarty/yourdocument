import { createOrgnize } from '@/services/organize';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import type { FC } from 'react';

interface CreateOegizeProps {
  onFinish?: () => void;
}

const CreateOegize: FC<CreateOegizeProps> = ({ onFinish }) => {
  const submit = async (values: { name: string; motto: string }) => {
    const { code } = await createOrgnize(values);
    return code === 202;
  };
  return (
    <ModalForm<{
      name: string;
      motto: string;
    }>
      title='创建组织'
      trigger={
        <Button type='primary'>
          <PlusOutlined />
          创建组织
        </Button>
      }
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        width: 400,
      }}
      onFinish={async (v) => {
        const ps = await submit(v);
        if (ps) {
          message.success('创建成功!!');
        }
        onFinish?.();

        return ps;
      }}
    >
      <ProFormText
        name='name'
        label='组织名称'
        rules={[{ required: true, message: '请输入组织名称' }]}
        placeholder='请输入名称'
      />

      <ProFormText
        name='motto'
        label='说明'
        rules={[{ required: true, message: '请输入说明' }]}
        placeholder='请输入说明'
      />
    </ModalForm>
  );
};

export default CreateOegize;
