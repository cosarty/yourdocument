import { QUESTION_TYPE_ENUM } from '@/constant/question';
import { getQuestionTitle } from '@/util/businessUtils';
import { MenuOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { arrayMoveImmutable, ProTable, useRefFunction } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { message, Tag } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';

import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import styles from './index.less';

const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);

const columns: (editQuestion: any, editGrade: any) => ProColumns[] = (editQuestion, editGrade) => [
  {
    title: '排序',
    dataIndex: 'sort',
    width: 60,
    className: styles['drag-visible'],
    render: () => <DragHandle />,
  },
  {
    title: '题目',
    dataIndex: ['question', 'title'],
    className: styles['drag-visible'],
    width: 120,
    render: (_, { question }) => {
      return <span> {getQuestionTitle(question)}</span>;
    },
  },
  {
    title: '题型',
    dataIndex: ['question', 'type'],
    className: styles['drag-visible'],
    width: 120,
    render: (_) => {
      return <span> {QUESTION_TYPE_ENUM[_?.toString()]}</span>;
    },
  },
  {
    title: '分数',
    dataIndex: 'grade',
    width: 80,
    render: (_, record) => {
      return (
        <Paragraph
          editable={{
            onChange: (v) => {
              if (!/^\d+$/.test(v) && Number.isNaN(Number(v)))
                return message.warn('成绩只允许正整数');
              if (Number(v) === record.grade) return;
              editGrade({ _id: record.question._id, grade: Number(v) });
            },
            autoSize: { maxRows: 1, minRows: 1 },
            tooltip: '编辑分数',
          }}
        >
          {_?.toString()}
        </Paragraph>
      );
    },
  },
  {
    title: '操作',
    width: 180,
    key: 'option',
    valueType: 'option',
    render: (_, record) => {
      return (
        <>
          {/* <Button type='link'>查看</Button> */}
          <Tag
            color='#cd201f'
            onClick={() => {
              editQuestion(record);
            }}
          >
            移除
          </Tag>
        </>
      );
    },
  },
];

export type QuestionTableType = {
  onReady?: (v: any) => void;
};

const QuestionTable: FC<QuestionTableType> = ({ onReady }) => {
  const SortableItem = SortableElement((props: any) => <tr {...props} />);
  const SortContainer = SortableContainer((props: any) => <tbody {...props} />);

  const { checkQuetion, editQuestion, editGrade } = useModel('checkQuestions');
  const [dataSource, setDataSource] = useState<any>([]);

  useEffect(() => {
    setDataSource(checkQuetion);
  }, [checkQuetion]);

  useEffect(() => {
    const data = dataSource.map((q) => ({ question: q.question._id, grade: q.grade }));
    onReady?.(data);
  }, [dataSource]);

  const onSortEnd = useRefFunction(
    ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
      if (oldIndex !== newIndex) {
        const newData = arrayMoveImmutable([...dataSource], oldIndex, newIndex).filter(
          (el) => !!el,
        );
        setDataSource([...newData]);
      }
    },
  );

  const DraggableContainer = (props: any) => (
    <SortContainer
      useDragHandle
      disableAutoscroll
      helperClass={styles['row-dragging']}
      onSortEnd={onSortEnd}
      {...props}
    />
  );

  const DraggableBodyRow = (props: any) => {
    const { className, style, ...restProps } = props;
    const index = dataSource.findIndex((x) => x.index === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };

  return (
    <ProTable
      className={styles['question-table']}
      headerTitle={false}
      columns={columns(editQuestion, editGrade)}
      rowKey='index'
      search={false}
      pagination={false}
      options={false}
      dataSource={dataSource}
      defaultExpandAllRows
      components={{
        body: {
          wrapper: DraggableContainer,
          row: DraggableBodyRow,
        },
      }}
    />
  );
};

export default QuestionTable;
