import { MESSAGE_STATUS_ENUM, MESSAGE_STATUS_MAP } from '@/constant/message';
import {
  clearMessage,
  MessageType,
  searchMessage,
  updateAllMessage,
  updateMessage,
} from '@/services/message';
import { FilterOutlined } from '@ant-design/icons';
import { LightFilter, ProFormSelect } from '@ant-design/pro-components';
import { Badge, Button, Card, List, message, Modal, Popconfirm, Space } from 'antd';
import { useEffect, useState } from 'react';

const DEFAULT_PAGE_PARAMS = {
  pageNum: 1,
  pageSize: 8,
};

const MyMessage = () => {
  const [list, setList] = useState<MessageType[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [refresh, setRefresh] = useState<boolean>(false);
  const initSearchParams = {
    ...DEFAULT_PAGE_PARAMS,
    status: MESSAGE_STATUS_ENUM.UNREAD.toString(),
  };
  const [searchParams, setSearchParams] = useState<{
    status?: string;
    pageSize: number;
    pageNum: number;
  }>(initSearchParams);
  const [loading, setLoading] = useState<boolean>(true);
  const [readAllLoading, setReadAllLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<Record<string, boolean>>({});

  /**
   * 加载
   */
  const doSearch = () => {
    setLoading(true);
    searchMessage(searchParams)
      .then(({ data: res }) => {
        setTotal(res?.total ?? 0);
        setList(res?.list ?? []);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    doSearch();
  }, [searchParams, refresh]);

  const doReadMessage = async (item: MessageType, index: number) => {
    const { _id, status } = item;
    if (status !== MESSAGE_STATUS_ENUM.UNREAD) {
      return;
    }
    list[index].status = MESSAGE_STATUS_ENUM.HAS_READ;
    setList([...list]);
    await updateMessage({ messageId: _id, status: '1' });
  };

  /**
   * 全部阅读
   */
  const doReadAll = async () => {
    setReadAllLoading(true);
    const res = await updateAllMessage();
    if (res.code === 200) {
      message.success('操作成功');
      setRefresh(!refresh);
    } else {
      message.error('操作失败，请重试');
    }
    setReadAllLoading(false);
  };

  const doClearAll = async () => {
    Modal.confirm({
      title: '确定要清空消息么？',
      onOk: async () => {
        const res = await clearMessage();
        if (res.code !== 202) {
          message.error('操作失败');
          return;
        }
        message.success('清空成功');
        setRefresh(!refresh);
      },
    });
  };

  const doDeleteMessage = async (messageId: string) => {
    setDeleteLoading({ [messageId]: true });
    const res = await updateMessage({ messageId, isDelete: true });

    if (res) {
      message.success('操作成功');
      doSearch();
    } else {
      message.error('操作失败，请重试');
    }
    setDeleteLoading({ [messageId]: false });
  };

  return (
    <Card
      title={`我的消息(${total})`}
      extra={
        <Space size={16}>
          <Button onClick={doReadAll} loading={readAllLoading}>
            全部已读
          </Button>
          <Button onClick={doClearAll}>清空</Button>
        </Space>
      }
    >
      <LightFilter
        bordered
        collapseLabel={<FilterOutlined />}
        initialValues={{
          status: MESSAGE_STATUS_ENUM.UNREAD.toString(),
        }}
        onFinish={async (values) => {
          const params = {
            ...DEFAULT_PAGE_PARAMS,
            ...values,
          };
          setSearchParams(params);
        }}
      >
        <ProFormSelect name='status' placeholder='消息状态' valueEnum={MESSAGE_STATUS_MAP} />
      </LightFilter>
      <div style={{ marginTop: 16 }} />
      <List<MessageType>
        loading={loading}
        itemLayout='horizontal'
        dataSource={list}
        renderItem={(item, index) => {
          const actions = [];
          actions.push(
            <Popconfirm
              title='确定删除该条消息么？'
              onConfirm={() => doDeleteMessage(item._id)}
              okText='确认'
              cancelText='取消'
            >
              <Button danger type='text' loading={deleteLoading[item._id]}>
                删除
              </Button>
            </Popconfirm>,
          );

          return (
            <List.Item
              key={item._id}
              actions={actions}
              className='message-list-item'
              onClick={() => doReadMessage(item, index)}
            >
              <List.Item.Meta
                title={
                  <>
                    {item.status === MESSAGE_STATUS_ENUM.UNREAD && <Badge color='red' />}
                    <span dangerouslySetInnerHTML={{ __html: item.title }} />
                  </>
                }
                description={<span dangerouslySetInnerHTML={{ __html: item.content }} />}
              />
              <div style={{ fontSize: 14, color: '#aaa' }}>
                {new Date(item.create_time).toLocaleDateString()}
              </div>
            </List.Item>
          );
        }}
        pagination={{
          pageSize: searchParams.pageSize ?? DEFAULT_PAGE_PARAMS.pageSize,
          current: searchParams.pageNum ?? 1,
          showSizeChanger: false,
          total,
          showTotal() {
            return `总数 ${total}`;
          },
          onChange: (pageNum, pageSize) => {
            const params = {
              ...searchParams,
              pageSize,
              pageNum,
            };
            setSearchParams(params);
          },
        }}
      />
    </Card>
  );
};

export default MyMessage;
