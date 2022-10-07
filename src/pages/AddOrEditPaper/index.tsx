import { ProCard, ProForm, ProFormText } from '@ant-design/pro-components';
import { Affix, Button, Card, Col, Row, Statistic } from 'antd';
import QuestionTable from './components/QuestionTable';

const AddOrEditPaper = () => {
  return (
    <ProForm submitter={false} layout='horizontal'>
      <Row gutter={[16, 16]}>
        <Col xs={{ span: 24 }} sm={{ span: 24 }} xl={{ span: 12 }}>
          <Card bordered={false} title='试卷详情' bodyStyle={{ marginBottom: 20 }}>
            <ProForm.Group>
              <ProFormText name='name' label='名称' placeholder='请输入名称' />
              <ProFormText name='detail' label='描述' placeholder='请输入名称' />
            </ProForm.Group>
          </Card>
          <ProCard.Group direction={'row'} title='总题数' style={{ marginBottom: 20 }}>
            <ProCard>
              <Statistic title='判断题' value={2} />
            </ProCard>
            <ProCard>
              <Statistic title='单选题' value={3} />
            </ProCard>
            <ProCard>
              <Statistic title='多选题' value={4} />
            </ProCard>
            <ProCard>
              <Statistic title='简答题' value={5} />
            </ProCard>
          </ProCard.Group>
          <Card title='题目'>
            <QuestionTable />
          </Card>
          <Affix offsetBottom={20}>
            <Card style={{ marginTop: 20, textAlign: 'center' }}>
              <Button type='primary'>完成</Button>
            </Card>
          </Affix>
        </Col>
        <Col xs={{ span: 24 }} sm={{ span: 24 }} xl={{ span: 12 }}>
          <Card bordered={false} title='选题'>
            题目
          </Card>
        </Col>
      </Row>
    </ProForm>
  );
};

export default AddOrEditPaper;
