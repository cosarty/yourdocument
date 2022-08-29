import SelectTag from '@/components/SelectTag';
import {
  QUESTION_DIFFICULTY_ENUM,
  QUESTION_TYPE_ENUM,
  REVIEW_STATUS_ENUM,
} from '@/constant/question';
import { searchQuetions } from '@/services/question';
import { AppstoreAddOutlined, OrderedListOutlined, TagsOutlined } from '@ant-design/icons';
import { ProForm, ProFormInstance } from '@ant-design/pro-components';
import { useSearchParams } from '@umijs/max';
import { Card, Radio } from 'antd';
import { useEffect, useRef, useState } from 'react';
import styles from './index.less';

const tabListNoTitle = [
  {
    key: 'update_time',
    tab: '最新',
  },
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
  const [params] = useSearchParams();

  const [searchParams, setSearchParams] = useState<Payload.QuestionSearchParams>({
    orderKey: 'update_time',
    pageSize: 11,
    pageNum: 1,
  });

  useEffect(() => {
    const q = params.get('q');
    setSearchParams({ ...searchParams, title: !!q ? q.trim() : '' });
  }, [params]);

  const handleSearch = async () => {
    const data = await searchQuetions({ ...searchParams, reviewStatus: REVIEW_STATUS_ENUM.PASS });
    console.log('data: ', data);
  };

  const valueChange = (changedValues: any) => {
    console.log('changedValues: ', changedValues);
    if (changedValues.name !== undefined) {
      return;
    }

    setSearchParams({ ...searchParams, ...changedValues, pageNum: 1 });
  };

  useEffect(() => {
    // 搜索
    handleSearch();
  }, [searchParams]);

  return (
    <div className={styles['qutions_search_home']}>
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
                        setSearchParams({
                          ...searchParams,
                          type: undefined,
                        });
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
                        setSearchParams({
                          ...searchParams,
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
        activeTabKey={searchParams.orderKey}
        bodyStyle={{
          paddingTop: 8,
        }}
        onTabChange={(key) => {
          setSearchParams({
            ...searchParams,
            pageNum: 1,
            orderKey: key as 'update_time' | 'favourNum',
          });
        }}
      >
        1
      </Card>
    </div>
  );
};

export default Home;
