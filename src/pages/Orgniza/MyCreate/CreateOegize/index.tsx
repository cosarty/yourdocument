import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { Button } from 'antd';
const CreateOegize = () => {
  return (
    <ModalForm<{
      name: string;
      company: string;
    }>
      title='添加组织'
      trigger={
        <Button type='primary'>
          <PlusOutlined />
          添加组织
        </Button>
      }
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        width: 400,
      }}
      onFinish={async (values) => {
        console.log('values: ', values);
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
