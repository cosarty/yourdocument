import { createOrgnize, editOrgnize } from '@/services/organize';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { FC } from 'react';

interface CreateOegizeProps {
  onFinish?: (v?: ogInfo) => void;
  edit: boolean;
  ogInfo?: {
    name: string;
    motto: string;
    id: string;
  };
}

type ogInfo = Exclude<CreateOegizeProps['ogInfo'], undefined>;

const CreateOrEditOegize: FC<CreateOegizeProps> = ({ onFinish, edit = false, ogInfo }) => {
  const submit = async (values: ogInfo) => {
    const { code, message: msg } = edit
      ? await editOrgnize(ogInfo!.id, values)
      : await createOrgnize(values);

    if (code === 202) {
      message.success(msg);

      onFinish?.(edit ? { ...values, id: ogInfo!.id } : ({} as ogInfo));
    }

    return code === 202;
  };
  return (
    <ModalForm<ogInfo>
      title={edit ? '编辑组织' : '创建组织'}
      trigger={
        edit ? (
          <EditOutlined />
        ) : (
          <Button type='primary'>
            <PlusOutlined />
            创建组织
          </Button>
        )
      }
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        width: 400,
      }}
      onFinish={submit}
      request={async () => {
        return ogInfo ?? ({} as ogInfo);
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

export default CreateOrEditOegize;
