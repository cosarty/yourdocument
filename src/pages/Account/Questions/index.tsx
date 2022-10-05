import QuestionItem from '@/components/QuestionItem';
import {
  QUESTION_DIFFICULTY_ENUM,
  QUESTION_TYPE_ENUM,
  REVIEW_STATUS_MAP,
} from '@/constant/question';
import type { QuestionsType } from '@/services/question';
import { searchOriginQuestion } from '@/services/question';
import { LightFilter, ProFormSelect } from '@ant-design/pro-components';
import { Link } from '@umijs/max';
import { Button, Card, Empty, List, message } from 'antd';
import { useEffect, useState } from 'react';

const DEFAULT_PAGE_PARAMS = {
  pageNum: 1,
  pageSize: 10,
};

const Questions = () => {
  const [list, setList] = useState<QuestionsType[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchParams, setSearchParams] =
    useState<Payload.QuestionSearchParams>(DEFAULT_PAGE_PARAMS);
  const [refresh, setRefresh] = useState<boolean>(true);

  /**
   * 搜索
   */
  const doSearch = async () => {
    setLoading(true);

    const res = await searchOriginQuestion(searchParams);

    if (res.code === 200) {
      setTotal(res?.data?.total ?? 0);
      setList(res?.data?.list ?? []);
    } else {
      message.error('加载数据失败，请刷新重试');
    }
    setLoading(false);
  };

  useEffect(() => {
    doSearch();
  }, [searchParams, refresh]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [searchParams]);

  return (
    <Card title={`上传记录（${total}）`}>
      <LightFilter
        bordered
        onFinish={async (values) => {
          const params = {
            ...DEFAULT_PAGE_PARAMS,
            ...values,
          };
          setSearchParams(params);
        }}
      >
        <ProFormSelect name='reviewStatus' placeholder='题目状态' valueEnum={REVIEW_STATUS_MAP} />
        <ProFormSelect name='type' placeholder='题型' valueEnum={QUESTION_TYPE_ENUM} />
        <ProFormSelect name='difficulty' placeholder='难度' valueEnum={QUESTION_DIFFICULTY_ENUM} />
      </LightFilter>
      <div style={{ marginTop: 16 }} />
      <List<QuestionsType>
        itemLayout='vertical'
        loading={loading}
        pagination={{
          pageSize: searchParams.pageSize ?? DEFAULT_PAGE_PARAMS.pageSize,
          current: searchParams.pageNum ?? DEFAULT_PAGE_PARAMS.pageNum,
          showSizeChanger: false,
          total,
          onChange: (pageNum, pageSize) => {
            const params = {
              ...searchParams,
              pageSize,
              pageNum,
            };
            setSearchParams(params);
          },
        }}
        dataSource={list}
        renderItem={(item) => {
          return (
            <QuestionItem
              showPricateState
              question={item}
              showReview
              showEdit
              showActions
              onReload={() => setRefresh(!refresh)}
            />
          );
        }}
        locale={{
          emptyText: (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='您还没有上传过题目哦'>
              <Link to='/addQuestion'>
                <Button type='primary' size='large'>
                  上传题目
                </Button>
              </Link>
            </Empty>
          ),
        }}
      />
    </Card>
  );
};

export default Questions;
