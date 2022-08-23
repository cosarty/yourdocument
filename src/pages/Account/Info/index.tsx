import defaultAvtar from '@/assets/shitijun.png';
import { Avatar, Card, Descriptions, Space, Tag } from 'antd';
import Title from 'antd/lib/typography/Title';
import styles from './style.less';
import UploadUser from './UploadUser';
const UserInfo = () => {
  return (
    <div>
      <Card>
        <Card.Meta
          className={styles.cardMeta}
          avatar={<Avatar src={defaultAvtar} size={96} />}
          title={
            <Space align='end'>
              <Title level={4} style={{ marginBottom: 0 }}>
                {'dsad'}
              </Title>
              <Tag color={'red'} style={{ marginRight: 0, marginBottom: 3 }}>
                {'dadsa'}
              </Tag>

              <Tag color='red' style={{ marginBottom: 3 }}>
                管理员
              </Tag>
            </Space>
          }
        />
      </Card>
      <div style={{ marginTop: 15 }}>
        <Card title='信息' extra={<UploadUser></UploadUser>}>
          <Descriptions column={1} labelStyle={{ width: 100, marginBottom: 8 }} colon={false}>
            <Descriptions.Item label='积分'>{1}</Descriptions.Item>
            <Descriptions.Item label='性别'>{'暂无'}</Descriptions.Item>
            <Descriptions.Item label='简介'>{1 || '暂无'}</Descriptions.Item>
            <Descriptions.Item label='邮箱'>{'暂无'}</Descriptions.Item>
            <Descriptions.Item label='注册时间'>
              {/* {formatDateTimeStr(user._createTime)} */}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
    </div>
  );
};

export default UserInfo;
