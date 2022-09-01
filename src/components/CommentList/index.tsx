import { Card, List, Space } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

// import { CommentSearchParams, searchComments } from '@/services/comment';
import { useAccess } from '@umijs/max';

import './index.less';
// import { useModel } from '@umijs/max';
import { CommentType, getComment } from '@/services/comment';
import type { QuestionsType } from '@/services/question';
import AddCommentModal from '../AddCommentModal';
import CommentItem from '../CommentItem';

interface CommentListProps {
  question: QuestionsType;
}

const DEFAULT_PAGE_SIZE = 8;

/**
 * 回答列表
 * @param props
 * @constructor
 */
const CommentList: React.FC<CommentListProps> = (props) => {
  const { question } = props;
  const topRef = useRef<HTMLDivElement>(null);

  const initSearchParams = {
    pageSize: DEFAULT_PAGE_SIZE,
    pageNum: 1,
  };

  const [searchParams, setSearchParams] = useState(initSearchParams);
  const [list, setList] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);

  const { canLogin } = useAccess();

  // const { initialState } = useModel('@@initialState');
  // const { currentUser } = initialState || {};

  /**
   * 评论
   */
  const loadData = async () => {
    if (!question._id) {
      return;
    }
    setLoading(true);
    const res = await getComment({
      questionId: question._id,
    });
    if (res.code === 200) {
      setList(res?.data ?? []);
      setTotal(res?.data?.length ?? 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (question?._id) {
      loadData();
    }
  }, [searchParams, question]);

  if (!question) {
    return <></>;
  }

  return (
    <>
      <div ref={topRef} />
      <Card
        className='comment-list'
        title={
          <Space size='large'>
            <div>
              {question?.commentNum && question.commentNum > 0 ? question.commentNum : 0}个回答
            </div>
          </Space>
        }
        bodyStyle={{ paddingTop: 8 }}
        extra={
          canLogin &&
          question && (
            <AddCommentModal
              questionId={question._id}
              onReload={(comment) => {
                const newCommentList = [comment, ...list];
                setList(newCommentList);
              }}
            />
          )
        }
      >
        <List<CommentType>
          itemLayout='vertical'
          dataSource={list}
          loading={loading}
          renderItem={(comment) => {
            return (
              <CommentItem
                comment={comment}
                key={comment._id}
                onDelete={() => {
                  const index = list.findIndex((item) => item._id === comment._id);
                  if (index > -1) {
                    list.splice(index, 1);
                    setList([...list]);
                  }
                }}
              />
            );
          }}
          pagination={{
            pageSize: searchParams.pageSize ?? DEFAULT_PAGE_SIZE,
            current: searchParams.pageNum ?? 1,
            showSizeChanger: false,
            total,
            showTotal() {
              return `总数 ${total ?? 0}`;
            },
            onChange(pageNum, pageSize) {
              const params = {
                ...searchParams,
                pageSize,
                pageNum,
              };
              setSearchParams(params);
              // 回到回答区顶部
              if (topRef?.current) {
                window.scrollTo(0, topRef.current.offsetTop);
              }
            },
          }}
        />
      </Card>
    </>
  );
};

export default CommentList;
