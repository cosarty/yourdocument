import QuestionItem from '@/components/QuestionItem';
import SelectTag from '@/components/SelectTag';
import type { QuestionsType } from '@/services/question';
import { getfavourQuestion } from '@/services/question';
import { Link } from '@umijs/max';
import { Button, Card, Empty, Form, List, message } from 'antd';
import { useEffect, useState } from 'react';
const DEFAULT_PAGE_PARAMS = {
  pageNum: 1,
  pageSize: 10,
};

const Favour = () => {
  const [questions, setQuestions] = useState<QuestionsType[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchParams, setSearchParams] =
    useState<Payload.QuestionSearchParams>(DEFAULT_PAGE_PARAMS);

  /**
   * 搜索
   */
  const doSearch = async (val?: any) => {
    setLoading(true);
    const res = await getfavourQuestion(val ?? {});

    if (res.code === 200) {
      setTotal(res.data?.length ?? 0);
      setQuestions(res.data ?? []);
    } else {
      message.error('加载数据失败，请刷新重试');
    }
    setLoading(false);
  };
  useEffect(() => {
    doSearch();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [searchParams]);

  return (
    <Card title={`我的收藏（${total}）`}>
      <Form<{ tags: [] }>
        onValuesChange={async (values: { tags: string[] }) => {
          doSearch(values.tags.length > 0 ? values : undefined);
          setSearchParams({
            ...DEFAULT_PAGE_PARAMS,
          });
        }}
      >
        <Form.Item name='tags'>
          <SelectTag placeholder='支持按标签搜索' />
        </Form.Item>
      </Form>
      <div style={{ marginTop: 16 }} />
      <List<QuestionsType>
        itemLayout='vertical'
        loading={loading}
        pagination={{
          showSizeChanger: false,
          pageSize: searchParams.pageSize ?? DEFAULT_PAGE_PARAMS.pageSize,
          current: searchParams.pageNum ?? DEFAULT_PAGE_PARAMS.pageNum,
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
        dataSource={questions}
        renderItem={(item) => {
          return <QuestionItem question={item} />;
        }}
        locale={{
          emptyText: (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='您还没有收藏的题目哦'>
              <Link to='/'>
                <Button type='primary' size='large'>
                  探索题目
                </Button>
              </Link>
            </Empty>
          ),
        }}
      />
    </Card>
  );
};

export default Favour;
