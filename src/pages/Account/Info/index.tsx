import defaultAvtar from '@/assets/shitijun.png';
import { USER_AUTH_ENUM, USER_GENDER_ENUM } from '@/constant/user';
import { useModel } from '@umijs/max';
import { Avatar, Card, Descriptions, Space, Tag } from 'antd';
import Title from 'antd/lib/typography/Title';
import styles from './style.less';
import UploadUser from './UploadUser';
const UserInfo = () => {
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;
  return (
    <div>
      <Card>
        <Card.Meta
          className={styles.cardMeta}
          avatar={<Avatar src={currentUser?.avtar_url || defaultAvtar} size={96} />}
          title={
            <Space align='end'>
              <Title level={4} style={{ marginBottom: 0 }}>
                {currentUser?.nickname}
              </Title>

              <Tag
                color={USER_AUTH_ENUM[currentUser?.auth || 'user'].color}
                style={{ marginBottom: 3 }}
              >
                {USER_AUTH_ENUM[currentUser?.auth || 'user'].text}
              </Tag>
            </Space>
          }
        />
      </Card>
      <div style={{ marginTop: 15 }}>
        <Card title='信息' extra={<UploadUser></UploadUser>}>
          <Descriptions column={1} labelStyle={{ width: 100, marginBottom: 8 }} colon={false}>
            <Descriptions.Item label='性别'>
              {USER_GENDER_ENUM[currentUser?.gender ?? ''] || '暂无'}
            </Descriptions.Item>
            <Descriptions.Item label='简介'>{currentUser?.profile || '暂无'}</Descriptions.Item>
            <Descriptions.Item label='邮箱'>{currentUser?.email}</Descriptions.Item>
            <Descriptions.Item label='注册时间'>
              {new Date(currentUser?.create_time || '').toLocaleDateString()}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
    </div>
  );
};

export default UserInfo;
