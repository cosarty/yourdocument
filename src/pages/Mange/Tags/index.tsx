import { Card, Tabs } from 'antd';

const MangeTags = () => {
  return (
    <Card>
      <Tabs defaultActiveKey='1'>
        <Tabs.TabPane tab='Tab 1' key='1'>
          Content of Tab Pane 1
        </Tabs.TabPane>
        <Tabs.TabPane tab='Tab 2' key='2'>
          Content of Tab Pane 2
        </Tabs.TabPane>
        <Tabs.TabPane tab='Tab 3' key='3'>
          Content of Tab Pane 3
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};

export default MangeTags;
