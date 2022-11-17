import QuestionItem from '@/components/QuestionItem';
import type { QuestionsType } from '@/services/question';
import { searchHistoryQuestion } from '@/services/question';
import { Card, Empty, List, message } from 'antd';
import { useEffect, useState } from 'react';

const DEFAULT_PAGE_PARAMS = {
  pageNum: 1,
  pageSize: 10,
};

const History = () => {
  const [list, setList] = useState<QuestionsType[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchParams, setSearchParams] =
    useState<Payload.QuestionSearchParams>(DEFAULT_PAGE_PARAMS);

  /**
   * 搜索
   */
  const doSearch = async () => {
    setLoading(true);

    const res = await searchHistoryQuestion(searchParams);

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
  }, [searchParams]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [searchParams]);

  return (
    <Card title={`浏览记录（${total}）`}>
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
          return <QuestionItem question={item} />;
        }}
        locale={{
          emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='暂无上传题目' />,
        }}
      />
    </Card>
  );
};

export default History;
