import { MenuOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { arrayMoveImmutable, ProTable, useRefFunction } from '@ant-design/pro-components';
import { Button, Tag } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';

import { useEffect, useState } from 'react';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import styles from './index.less';

const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);

const columns: ProColumns[] = [
  {
    title: '排序',
    dataIndex: 'sort',
    width: 60,
    className: styles['drag-visible'],
    render: () => <DragHandle />,
  },
  {
    title: '题目',
    dataIndex: 'name',
    className: styles['drag-visible'],
    width: 120,
  },
  {
    title: '分数',
    dataIndex: 'age',
    width: 80,
    render: (_) => {
      return (
        <Paragraph
          editable={{
            onChange: (v) => {
              console.log(v);
            },
            autoSize: { maxRows: 1, minRows: 1 },
            tooltip: '编辑分数',
          }}
        >
          {_}
        </Paragraph>
      );
    },
  },
  {
    title: '操作',
    width: 180,
    key: 'option',
    valueType: 'option',
    render: () => {
      return (
        <>
          <Button type='link'>查看</Button>
          <Tag color='#cd201f'>移除</Tag>
        </>
      );
    },
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    index: 0,
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    index: 1,
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    index: 2,
  },
];

const QuestionTable = () => {
  const [dataSource, setDataSource] = useState(data);
  const SortableItem = SortableElement((props: any) => <tr {...props} />);
  const SortContainer = SortableContainer((props: any) => <tbody {...props} />);

  useEffect(() => {
    console.log(dataSource);
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
      columns={columns}
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
