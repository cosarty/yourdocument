import CommentItem from '@/components/CommentItem';
import { CommentType, searchComment } from '@/services/comment';
import { Link } from '@umijs/max';
import { Button, Card, Empty, List, message } from 'antd';
import { useEffect, useState } from 'react';
export interface PageSearchParams {
  pageSize?: number;
  pageNum?: number;
  orderKey?: string;
  order?: 'desc' | 'asc';
}

const DEFAULT_PAGE_PARAMS = {
  pageNum: 1,
  pageSize: 10,
};

const Comment = () => {
  const [list, setList] = useState<CommentType[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchParams, setSearchParams] = useState<PageSearchParams>(DEFAULT_PAGE_PARAMS);
  const [refresh, setRefresh] = useState<boolean>(true);

  /**
   * 搜索
   */
  const doSearch = async () => {
    setLoading(true);

    const res = await searchComment();
    if (res.code === 200) {
      setTotal(res.data?.length ?? 0);
      setList(res.data ?? []);
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
    <Card title={`我的回答（${total}）`} bodyStyle={{ paddingTop: 0 }}>
      <List<CommentType>
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
        renderItem={(comment) => {
          return (
            <CommentItem
              comment={comment}
              key={comment._id}
              showQuestion
              onDelete={() => setRefresh(!refresh)}
            />
          );
        }}
        locale={{
          emptyText: (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='您还没有写过回答哦'>
              <Link to='/'>
                <Button type='primary' size='large'>
                  去回答问题
                </Button>
              </Link>
            </Empty>
          ),
        }}
      />
    </Card>
  );
};

export default Comment;
