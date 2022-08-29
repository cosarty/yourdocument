import SelectTag from '@/components/SelectTag';
import { TagsOutlined } from '@ant-design/icons';
import { ProForm } from '@ant-design/pro-components';
import { Card } from 'antd';

const formItemLayout = {
  labelCol: {
    sm: {
      span: 4,
    },
    lg: {
      span: 3,
    },
    xl: {
      span: 2,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
  },
};

const Home = () => {
  const valueChange = (changedValues: any) => {
    console.log('changedValues: ', changedValues);
    if (changedValues.name !== undefined) {
      return;
    }
  };

  return (
    <div>
      <Card bordered={false} bodyStyle={{ marginBottom: 0 }}>
        <ProForm
          submitter={false}
          onValuesChange={valueChange}
          {...formItemLayout}
          layout={'horizontal'}
        >
          <ProForm.Item
            name={'tags'}
            labelAlign={'left'}
            label={
              <>
                <TagsOutlined /> <span style={{ marginLeft: 8 }}>筛选</span>
              </>
            }
          >
            <SelectTag />
          </ProForm.Item>
        </ProForm>
      </Card>
    </div>
  );
};

export default Home;
