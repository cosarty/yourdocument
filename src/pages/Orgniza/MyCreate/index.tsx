import type { OrganizeType } from '@/services/organize';
import { getSelfOrgnize } from '@/services/organize';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { Link } from '@umijs/max';
import { Card, Col, Row, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import CreateOegize from './CreateOegize';

const MyCreateOrgnize = () => {
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

  return (
    <Card loading={loading} title='我创建的组织' extra={<CreateOegize />}>
      <Row gutter={[16, { sm: 12, md: 20, lg: 26 }]}>
        {orgnizaList.map((og) => (
          <Col xs={24} sm={24} md={12} lg={8} xl={6} key={og.name}>
            <ProCard
              hoverable
              bordered
              title={<Link to={'/'}>{og.name}</Link>}
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
    </Card>
  );
};

export default MyCreateOrgnize;
