import defaultAvtar from '@/assets/shitijun.png';
import type { CurrentUser } from '@/services/users';
import { banUser, deleteUser, getUserList, setPermission } from '@/services/users';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { useAccess } from '@umijs/max';
import { Image, message, Popconfirm, Select, Switch } from 'antd';
import { useRef } from 'react';

const MangeUser = () => {
  const actionRef = useRef<ActionType>();
  const { canSuper, canIsAdmin } = useAccess();
  const handleChange = async (userId: string, auth: string) => {
    const res = await setPermission({ userId, auth });
    if (res.code === 202) {
      message.success('设置成功');
    }
  };
  const columns: ProColumns<CurrentUser>[] = [
    {
      title: 'id',
      dataIndex: '_id',
      // copyable: true,
      ellipsis: true,
      width: 100,
      hideInSearch: true,
    },
    {
      title: '名称',
      dataIndex: 'nickname',
      // copyable: true,
      width: 150,
    },
    {
      title: '头像',
      dataIndex: 'avtar_url',
      width: 80,
      hideInSearch: true,
      render: (text, record) => {
        return <Image width={60} src={record?.avtar_url || defaultAvtar} />;
      },
    },
    {
      title: '简介',
      dataIndex: 'profile',
      copyable: true,
      hideInSearch: true,
    },
    {
      title: '权限',
      dataIndex: 'auth',
      valueType: 'radioButton',
      hideInSearch: canIsAdmin,
      valueEnum: {
        admin: { text: '管理员' },
        user: { text: ' 用户' },
      },
      render: (_, user) => {
        return canSuper ? (
          <Select
            defaultValue={user.auth}
            style={{ width: 120 }}
            onChange={(value) => {
              handleChange(user._id, value);
            }}
          >
            <Select.Option value='admin'>管理员</Select.Option>
            <Select.Option value='user'>普通用户</Select.Option>
          </Select>
        ) : (
          <span>{_}</span>
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      dataIndex: 'fenhao',
      valueType: 'option',
      title: '封号',
      render: (_, user) => (
        <Switch
          checkedChildren='解封'
          unCheckedChildren='封号'
          defaultChecked={user?.is_ban}
          onClick={async () => {
            const res = await banUser({ userId: user._id ?? '' });
            if (res.code === 202) {
              message.success(res.message);
            } else {
              message.error('操作失败');
            }
          }}
        />
      ),
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      hideInTable: !canSuper,
      render: (_, user) => (
        <Popconfirm
          title='确认删除么，操作无法撤销'
          onConfirm={async () => {
            const res = await deleteUser({ userId: user?._id ?? '' });
            if (res.code === 202) {
              message.success(res.message);
              actionRef?.current?.reload();
            } else {
              message.error('操作失败');
            }
          }}
        >
          <a style={{ color: 'red' }}>删除</a>
        </Popconfirm>
      ),
    },
  ];

  return (
    <ProTable<CurrentUser>
      headerTitle='管理用户'
      actionRef={actionRef}
      rowKey='_id'
      search={{
        filterType: 'light',
      }}
      request={async (params) => {
        const res = await getUserList(params);
        if (res.code === 202) {
          return {
            data: res?.data?.userList,
            success: true,
            total: res?.data?.total ?? 0,
          };
        }

        return {};
      }}
      columns={columns}
    />
  );
};

export default MangeUser;
