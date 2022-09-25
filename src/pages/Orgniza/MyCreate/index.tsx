import type { OrganizeType } from '@/services/organize';
import { getSelfOrgnize } from '@/services/organize';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { Link } from '@umijs/max';
import { Col, Row, Space, Spin, Typography } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

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
                title={<Link to={'/vieworgani'}>{og.name}</Link>}
                headerBordered
                actions={[<EditOutlined key='edit' />, <DeleteOutlined key='ellipsis' />]}
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
