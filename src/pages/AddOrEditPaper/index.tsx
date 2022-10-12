import QueryQuestions from '@/components/QueryQuestions';
import { cratePaper, updatePaper, viewPaper } from '@/services/paper';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { history, useModel, useOutletContext } from '@umijs/max';
import { Affix, Button, Card, Col, message, Row } from 'antd';
import { useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import GradeStat from './components/GradeStat';
import QuestionTable from './components/QuestionTable';

export type FormFieldType = { name: string; detail: string };

const AddOrEditPaper = () => {
  const { initCheckQuestion } = useModel('checkQuestions');

  const [checkList, setCheckList] = useState([]);

  const { edit = false, paperId } = useOutletContext<{ edit?: boolean; paperId: string }>() ?? {};

  const submit = async (value: any) => {
    if (checkList.length === 0) return message.warn('试卷题目不能为空！！');
    let code: number, ms: string;
    if (edit) {
      ({ code, message: ms } = await updatePaper(paperId, {
        ...value,
        questions: checkList,
      }));
    } else {
      ({ code, message: ms } = await cratePaper({
        ...value,
        questions: checkList,
      }));
    }
    message.success(ms);
    if (code === 200) {
      history.push('/account/mypaper');
    }
  };

  return (
    <HelmetProvider>
      <Helmet>{<title>{edit ? '编辑试卷' : '添加试卷'} - 试题君</title>}</Helmet>
      <Row gutter={[16, 16]}>
        <Col xs={{ span: 24 }} sm={{ span: 24 }} xl={{ span: 12 }}>
          <ProForm<FormFieldType>
            submitter={false}
            layout='horizontal'
            onFinish={submit}
            request={async () => {
              if (!edit) return {} as FormFieldType;
              const { data } = await viewPaper(paperId);
              // 初始化选中的题目
              initCheckQuestion(data?.questions as any);
              return (
                { detail: data?.detail ?? '', name: data?.name ?? '' } ?? ({} as FormFieldType)
              );
            }}
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
                  {edit ? '编辑试卷' : '创建试卷'}
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
    </HelmetProvider>
  );
};

export default AddOrEditPaper;
