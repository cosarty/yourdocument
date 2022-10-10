import QueryQuestions from '@/components/QueryQuestions';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { Affix, Button, Card, Col, message, Row } from 'antd';
import { useState } from 'react';
import GradeStat from './components/GradeStat';
import QuestionTable from './components/QuestionTable';

const AddOrEditPaper = () => {
  const [checkList, setCheckList] = useState([]);

  const submit = async (value: any) => {
    console.log('value: ', value);
    if (checkList.length === 0) return message.warn('试卷题目不能为空！！');
  };

  return (
    <Row gutter={[16, 16]}>
      <Col xs={{ span: 24 }} sm={{ span: 24 }} xl={{ span: 12 }}>
        <ProForm submitter={false} layout='horizontal' onFinish={submit}>
          <Card bordered={false} title='试卷详情' bodyStyle={{ marginBottom: 20 }}>
            <ProFormText
              name='name'
              rules={[{ required: true, message: '请输入名称' }]}
              label='名称'
              placeholder='请输入名称'
            />
            <ProFormText
              name='detail'
              rules={[{ required: true, message: '请输入描述' }]}
              label='描述'
              placeholder='请输入名称'
            />
          </Card>
          <GradeStat />
          <Card title='题目'>
            <QuestionTable
              onReady={(data: any) => {
                setCheckList(data);
              }}
            />
          </Card>
          <Affix offsetBottom={20}>
            <Card style={{ marginTop: 20, textAlign: 'center' }}>
              <Button type='primary' htmlType='submit'>
                完成
              </Button>
            </Card>
          </Affix>
        </ProForm>
      </Col>
      <Col xs={{ span: 24 }} sm={{ span: 24 }} xl={{ span: 12 }}>
        <Card bordered={false} title='选题'>
          <QueryQuestions showMy isSelect />
        </Card>
      </Col>
    </Row>
  );
};

export default AddOrEditPaper;
