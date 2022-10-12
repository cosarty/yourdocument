import PaperItem from '@/components/PaperItem';
import type { SourcePaperType } from '@/services/paper';
import { getMyPaper } from '@/services/paper';
import { history, Link } from '@umijs/max';
import { Button, Card, Empty, List, message } from 'antd';
import { useEffect, useState } from 'react';

const MyPaper = () => {
  const [list, setList] = useState<SourcePaperType[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(true);
  /**
   * 搜索
   */
  const doSearch = async () => {
    setLoading(true);

    const { code, data } = await getMyPaper();

    if (code === 200) {
      setTotal(data?.length ?? 0);
      setList(data ?? []);
    } else {
      message.error('加载数据失败，请刷新重试');
    }
    setLoading(false);
  };

  useEffect(() => {
    doSearch();
  }, [refresh]);

  return (
    <Card
      title='试卷管理'
      extra={
        <Button
          type='primary'
          onClick={() => {
            history.push('/addPaper');
          }}
        >
          创建试卷
        </Button>
      }
    >
      {/* TODO 还未实现 */}
      {/* <LightFilter bordered>
        <ProFormSelect name='ownership' placeholder='范围' valueEnum={{ 0: '私有', 1: '公开' }} />
      </LightFilter> */}
      <List<SourcePaperType>
        itemLayout='vertical'
        loading={loading}
        pagination={{
          showSizeChanger: false,
          total,
        }}
        dataSource={list}
        renderItem={(item) => {
          return (
            <PaperItem
              paper={item}
              showReview
              showEdit
              showActions
              onReload={() => setRefresh(!refresh)}
            />
          );
        }}
        locale={{
          emptyText: (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='您还没有上传过试卷哦'>
              <Link to='/addPaper'>
                <Button type='primary' size='large'>
                  创建试卷
                </Button>
              </Link>
            </Empty>
          ),
        }}
      />
    </Card>
  );
};

export default MyPaper;
