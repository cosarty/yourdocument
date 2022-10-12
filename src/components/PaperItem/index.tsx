import type { SourcePaperType } from '@/services/paper';
import { history, Link } from '@umijs/max';
import { Button, List, message, Popconfirm, Space, Typography } from 'antd';
import type { FC } from 'react';
import './index.less';
interface PaperItemProps {
  paper: SourcePaperType;
  showReview?: boolean; // 显示审核状态
  showEdit?: boolean; // 显示修改
  showActions?: boolean; // 展示操作栏
  onReload?: () => void;
}

const { Title } = Typography;
const PaperItem: FC<PaperItemProps> = (props) => {
  const { paper = {} as SourcePaperType, showEdit, onReload } = props;

  const doDelete = async () => {
    // const res = await deletePaper(paper._id);
    onReload?.();
    message.success('操作成功');
    // if (res) {
    //   message.success('操作成功');
    //   if (onReload) {
    //     onReload();
    //   }
    // } else {
    //   message.error('操作失败');
    // }
  };

  const doEdit = () => {
    history.push(
      {
        pathname: '/editPaper',
      },
      { paperId: paper._id },
    );
  };
  return (
    <List.Item className='paper-item' key={paper.name}>
      <Link to={`/`} target='_blank'>
        <Title
          level={5}
          ellipsis={{ rows: 2 }}
          className='paper-item-title'
          style={{ height: 'auto' }}
        >
          <span>名称:{paper.name}</span>
        </Title>
      </Link>

      <Space direction='vertical'>
        <span>描述:{paper.detail}</span>
        <p>日期:{new Date(paper.create_time).toLocaleString()}</p>
      </Space>

      <div className='tags-row' style={{ height: 'auto' }}>
        {showEdit ? (
          <Space>
            <Popconfirm title='确认删除么，操作无法撤销' onConfirm={() => doDelete()}>
              <Button type='primary' danger onClick={() => {}}>
                删除
              </Button>
            </Popconfirm>

            <Button type='primary' onClick={doEdit}>
              编辑
            </Button>
            <Button onClick={doEdit}>下发</Button>
          </Space>
        ) : null}
      </div>
    </List.Item>
  );
};

export default PaperItem;
