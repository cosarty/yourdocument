import type { OrganizeType } from '@/services/organize';
import { deleteOrgnize, getSelfOrgnize } from '@/services/organize';
import { DeleteOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, Col, message, Popconfirm, Row, Space, Spin, Typography } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import CreateOrEditOegize from './CreateOrEditOegize';

export interface MyCreateOegizeRefType {
  reload: () => void;
}

const MyCreateOrgnize = forwardRef((_, ref) => {
  const [loading, setLoading] = useState(false);
  const [orgnizaList, setOrgnizaList] = useState<OrganizeType[]>([]);

  const doLoadData = async () => {
    setLoading(true);
    const { code, data } = await getSelfOrgnize();

    if (code === 200) {
      setOrgnizaList(data?.organizes ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    doLoadData();
  }, []);

  const renderPassPart = (part: OrganizeType['part'] = []) => {
    const passPart: { pass: number; noPass: number } = part.reduce(
      (c, p) => {
        if (p.pass) c.pass++;
        else c.noPass++;
        return c;
      },
      { pass: 0, noPass: 0 },
    );

    return (
      <>
        <span>人数:</span>
        <span style={{ fontWeight: 700 }}>{passPart.pass}</span>
        <span>待审核:</span>
        <span style={{ fontWeight: 700 }}>{passPart.noPass}</span>
      </>
    );
  };

  const actionHandle = async (key: 'edit' | 'delete', id: string) => {
    switch (key) {
      case 'edit':
        break;
      case 'delete':
        const { code } = await deleteOrgnize(id);
        if (code === 202) {
          message.success('删除成功!!!');
          await doLoadData();
        }
        break;
    }
  };

  // 重新加载数据
  useImperativeHandle(ref, () => ({
    reload: () => {
      doLoadData();
    },
  }));

  return (
    <>
      {loading ? (
        <div style={{ textAlign: 'center' }}>
          <Spin size='large' />
        </div>
      ) : (
        <Row gutter={[16, 24]}>
          {orgnizaList.map((og) => (
            <Col xs={24} sm={24} md={12} lg={8} xl={6} key={og.name}>
              <ProCard
                hoverable
                loading={loading}
                bordered
                title={
                  <Button
                    type='link'
                    onClick={() => {
                      history.push('/vieworgani/', { og });
                    }}
                  >
                    {og.name}
                  </Button>
                }
                headerBordered
                actions={[
                  <CreateOrEditOegize
                    key={'edit'}
                    edit
                    ogInfo={{ name: og.name, motto: og.motto, id: og._id }}
                    onFinish={(v) => {
                      const selfOg = orgnizaList.find((o) => o._id === v?.id) ?? {};
                      Object.assign(selfOg, { ...v });
                      setOrgnizaList([...orgnizaList]);
                    }}
                  />,
                  <Popconfirm
                    key='delete'
                    title='确定删除此组织？'
                    onConfirm={() => actionHandle('delete', og._id)}
                    okText='确认'
                    cancelText='取消'
                  >
                    <DeleteOutlined />
                  </Popconfirm>,
                ]}
                extra={
                  <Typography.Paragraph copyable={{ tooltips: ['邀请码'] }}>
                    {og.flag}
                  </Typography.Paragraph>
                }
              >
                <Space direction='vertical'>
                  <span>说明:</span>
                  <span style={{ fontWeight: 700 }}>{og.motto || '暂无'}</span>
                  <Space>{renderPassPart(og.part)}</Space>
                </Space>
              </ProCard>
            </Col>
          ))}
        </Row>
      )}
    </>
  );
});

export default MyCreateOrgnize;
