/* eslint-disable @typescript-eslint/no-shadow */
import defaultAvtar from '@/assets/shitijun.png';
import { DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Dropdown, List, Menu, message, Modal, Row, Space, Tag } from 'antd';
import React, { useState } from 'react';

import RichTextViewer from '@/components/RichTextViewer';

import { CommentType, deleteComment, priorityComment } from '@/services/comment';
import { useAccess, useModel } from '@umijs/max';
import AddCommentModal from '../AddCommentModal';
import './index.less';

interface CommentItemProps {
  comment: CommentType;
  onDelete: () => void;
  onUpdate: () => void;
}

const CommentItem: React.FC<CommentItemProps> = (props) => {
  const { comment = {} as CommentType, onDelete } = props;
  // 用于修改回答后的视图更新
  const [commentState, setCommentState] = useState<CommentType>(comment);
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  const access = useAccess();

  /**
   * 修改回答优先级
   */
  const doUpdateCommentPriority = async () => {
    if (!comment) {
      return;
    }

    const data = await priorityComment({
      commentId: comment?._id ?? '',
      priority: !commentState?.priority,
    });
    setCommentState({ ...commentState, priority: !commentState?.priority });
    message.success(data.message);
  };

  /**
   * 删除回答
   */
  const doDelete = async (commentId: string) => {
    await deleteComment(commentId);
    message.success('操作成功');
    onDelete();
  };

  const commentOpMenu = (comments: CommentType) => {
    return (
      <Menu
        onClick={(items: any) => {
          console.log('items: ', items);

          switch (items.key) {
            case 'delete':
              Modal.confirm({
                content: '是否确认删除？不可找回',
                onOk() {
                  doDelete(comments._id);
                },
              });
              break;
          }
        }}
        items={
          comments?.user?._id === currentUser?._id || access.canAdmin
            ? [
                { key: `delete`, icon: <DeleteOutlined />, label: '删除' },
                {
                  key: `edit`,
                  icon: <EditOutlined />,
                  label: (
                    <>
                      <AddCommentModal
                        content={comments.content}
                        commentId={comments?._id}
                        edit
                        onReload={(com) => {
                          setCommentState(com);
                        }}
                      />
                      ;
                    </>
                  ),
                },
              ]
            : []
        }
      />
    );
  };

  // @ts-ignore
  return (
    <List.Item className='comment-item'>
      <List.Item.Meta
        avatar={<Avatar src={commentState?.user?.avtar_url || defaultAvtar} />}
        title={
          <Row justify='space-between'>
            <div>{commentState.user.nickname}</div>
            <>
              {commentState.priority && (
                <Tag color='red' style={{ marginRight: 0 }}>
                  参考
                </Tag>
              )}
            </>
          </Row>
        }
        description={new Date(commentState.create_time).toLocaleDateString()}
      />
      {commentState.content && (
        <RichTextViewer key={commentState._id} htmlContent={commentState.content} />
      )}
      <Row justify='space-between' align='middle' style={{ marginTop: 12 }}>
        <Col>
          {/* <Space>
            <Button
              size='small'
              type='text'
              onClick={() => {
                // @ts-ignore
                replyListRef?.current?.setReplyInputState(true, '', '');
              }}
            >
              回复
            </Button>
          </Space> */}
        </Col>
        <Col>
          <Space>
            {/* {(comment?.user?._id === currentUser?._id || access.canAdmin) && (
              <Button
                size='small'
                type='text'
                onClick={() => {
                  console.log(1);
                }}
              >
                修改
              </Button>
            )} */}
            {(comment?.user?._id === currentUser?._id || access.canAdmin) && (
              <>
                <Button
                  size='small'
                  type='text'
                  danger={commentState.priority}
                  onClick={() => {
                    doUpdateCommentPriority();
                  }}
                >
                  {commentState.priority ? '取消' : ''}采纳
                </Button>
                <Dropdown
                  trigger={['click']}
                  overlay={() => commentOpMenu(comment)}
                  placement='bottomRight'
                >
                  <MoreOutlined />
                </Dropdown>
              </>
            )}
          </Space>
        </Col>
      </Row>
    </List.Item>
  );
};

export default CommentItem;
