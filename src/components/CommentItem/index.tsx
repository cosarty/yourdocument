/* eslint-disable @typescript-eslint/no-shadow */
import defaultAvtar from '@/assets/shitijun.png';
import { DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Col,
  Dropdown,
  List,
  Menu,
  message,
  Modal,
  Row,
  Space,
  Tag,
  Typography,
} from 'antd';
import React, { useState } from 'react';

import RichTextViewer from '@/components/RichTextViewer';

import type { CommentType } from '@/services/comment';
import { deleteComment, priorityComment } from '@/services/comment';
import type { QuestionsType } from '@/services/question';
import { getQuestionTitle } from '@/util/businessUtils';
import { Link, useAccess, useModel } from '@umijs/max';
import AddCommentModal from '../AddCommentModal';
import './index.less';

interface CommentItemProps {
  comment: CommentType;
  onDelete: () => void;
  questionId?: QuestionsType;
  showQuestion?: boolean;
}

const CommentItem: React.FC<CommentItemProps> = (props) => {
  const { comment = {} as CommentType, onDelete, questionId, showQuestion } = props;
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
  const doDelete = async () => {
    await deleteComment({ commentId: commentState._id, questionId: comment.questionId._id });
    message.success('删除成功!!');
    onDelete();
  };

  const commentOpMenu = (comments: CommentType) => {
    return (
      <Menu
        onClick={(items: any) => {
          switch (items.key) {
            case 'delete':
              Modal.confirm({
                content: '是否确认删除？不可找回',
                onOk() {
                  doDelete();
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
                        content={commentState.content}
                        commentId={comments?._id}
                        questionId={comments.questionId?._id}
                        edit
                        onReload={(com) => {
                          setCommentState({ ...commentState, content: com.content });
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
      {showQuestion && (
        <Typography.Title
          level={5}
          ellipsis={{ rows: 2 }}
          style={{ fontSize: 18, marginBottom: 16 }}
        >
          <Link
            to={`/qd/${comment.questionId?._id}/c/${comment?._id}`}
            style={{ color: 'rgba(0, 0, 0, 0.85)' }}
          >
            {getQuestionTitle(comment.questionId)}
          </Link>
        </Typography.Title>
      )}
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

      <RichTextViewer htmlContent={commentState.content} />

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
            {(questionId?.userId?._id === currentUser?._id || access.canAdmin) && (
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
              </>
            )}
            {(questionId?.userId?._id === currentUser?._id ||
              access.canAdmin ||
              comment?.user?._id === currentUser?._id) && (
              <Dropdown
                trigger={['click']}
                overlay={() => commentOpMenu(comment)}
                placement='bottomRight'
              >
                <MoreOutlined />
              </Dropdown>
            )}
          </Space>
        </Col>
      </Row>
    </List.Item>
  );
};

export default CommentItem;
