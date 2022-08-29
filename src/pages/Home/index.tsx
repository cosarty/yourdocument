import SelectTag from '@/components/SelectTag';
import { QUESTION_DIFFICULTY_ENUM, QUESTION_TYPE_ENUM } from '@/constant/question';
import { AppstoreAddOutlined, OrderedListOutlined, TagsOutlined } from '@ant-design/icons';
import { ProForm, ProFormInstance } from '@ant-design/pro-components';
import { Card, Radio } from 'antd';
import { useEffect, useRef, useState } from 'react';

const tabListNoTitle = [
  {
    key: 'create_time',
    tab: '最新',
  },
  // {
  //   key: 'viewNum',
  //   tab: '最热',
  // },
  {
    key: 'favourNum',
    tab: '收藏',
  },
];

const formItemLayout = {
  labelCol: {
    sm: {
      span: 3,
    },
    lg: {
      span: 2,
    },
    xl: {
      span: 1,
    },
  },
  wrapperCol: {
    xs: {
      span: 18,
    },
  },
};

const Home = () => {
  const formRef = useRef<ProFormInstance>();
  const [searchParams, setSearchParams] = useState<Payload.QuestionSearchParams>({});

  // const initSearchParams: QuestionSearchParams = {
  //   name: searchText ?? '',
  //   pageSize: DEFAULT_PAGE_SIZE,
  //   pageNum: 1,
  //   orderKey: searchText ? '_score' : 'publishTime',
  //   priority: undefined,
  // };

  const handleSearch = () => {};

  const valueChange = (changedValues: any) => {
    console.log('changedValues: ', changedValues);
    if (changedValues.name !== undefined) {
      return;
    }
  };

  useEffect(() => {
    // 搜索
    handleSearch();
  }, [searchParams]);

  return (
    <div>
      <Card bordered={false} bodyStyle={{ marginBottom: 0 }}>
        <ProForm
          formRef={formRef}
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
          <ProForm.Item
            name='type'
            label={
              <>
                <AppstoreAddOutlined /> <span style={{ marginLeft: 8 }}>题型</span>
              </>
            }
          >
            <Radio.Group buttonStyle='solid'>
              {Object.keys(QUESTION_TYPE_ENUM).map((typeKey) => {
                return (
                  <Radio.Button
                    key={typeKey}
                    value={typeKey}
                    onClick={() => {
                      if (formRef.current?.getFieldValue('type') === typeKey) {
                        formRef.current?.setFieldsValue({
                          type: undefined,
                        });
                        // setSearchParams({
                        //   ...searchParams,
                        //   type: undefined,
                        // });
                      }
                    }}
                  >
                    {QUESTION_TYPE_ENUM[typeKey]}
                  </Radio.Button>
                );
              })}
            </Radio.Group>
          </ProForm.Item>
          <ProForm.Item
            name='difficulty'
            label={
              <>
                <OrderedListOutlined /> <span style={{ marginLeft: 8 }}>难度</span>
              </>
            }
          >
            <Radio.Group buttonStyle='solid'>
              {Object.keys(QUESTION_DIFFICULTY_ENUM).map((difficultyKey) => {
                return (
                  <Radio.Button
                    key={difficultyKey}
                    value={difficultyKey}
                    onClick={() => {
                      if (formRef.current?.getFieldValue('difficulty') === difficultyKey) {
                        formRef.current?.setFieldsValue({
                          difficulty: undefined,
                        });
                      }
                    }}
                  >
                    {QUESTION_DIFFICULTY_ENUM[difficultyKey]}
                  </Radio.Button>
                );
              })}
            </Radio.Group>
          </ProForm.Item>
        </ProForm>
      </Card>
      <br />
      <Card
        tabList={tabListNoTitle}
        activeTabKey={'create_time'}
        bodyStyle={{
          paddingTop: 8,
        }}
        // tabBarExtraContent={
        //   <Checkbox.Group onChange={(value) => handleCheckboxChange(value)}>
        //     <Checkbox value="priority">精选</Checkbox>
        //     <Checkbox value="hasReference">有解</Checkbox>
        //   </Checkbox.Group>
        // }
        onTabChange={(key) => {
          // setSearchParams({
          //   ...searchParams,
          //   pageNum: 1,
          //   orderKey: key,
          // });
        }}
      >
        1
      </Card>
    </div>
  );
};

export default Home;
