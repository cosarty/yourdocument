import QueryQuestions from '@/components/QueryQuestions';
import { cratePaper } from '@/services/paper';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Affix, Button, Card, Col, message, Row } from 'antd';
import { useState } from 'react';
import GradeStat from './components/GradeStat';
import QuestionTable from './components/QuestionTable';

const AddOrEditPaper = () => {
  const [checkList, setCheckList] = useState([]);

  const submit = async (value) => {
    if (checkList.length === 0) return message.warn('试卷题目不能为空！！');
    const { code } = await cratePaper({
      ...value,
      questions: checkList,
    });
    message.success(code === 200 ? '创建成功' : '创建失败');
    if (code === 200) {
      history.push('/account/mypaper');
    }
  };

  return (
    <Row gutter={[16, 16]}>
      <Col xs={{ span: 24 }} sm={{ span: 24 }} xl={{ span: 12 }}>
        <ProForm<{ name: string; detail: string }>
          submitter={false}
          layout='horizontal'
          onFinish={submit}
        >
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
                创建试卷
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
