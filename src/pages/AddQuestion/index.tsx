import RichTextEditor from '@/components/RichTextEditor';
import SelectTag from '@/components/SelectTag';
import { QUESTION_DIFFICULTY_ENUM, QUESTION_TYPE_ENUM } from '@/constant/question';
import { ProForm, ProFormDependency, ProFormList, ProFormRadio } from '@ant-design/pro-components';
import { Button, Card, Col, Row } from 'antd';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 5,
    },
    md: {
      span: 4,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 19,
    },
    md: {
      span: 20,
    },
  },
};

const submitFormLayout = {
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
      offset: 5,
    },
    md: {
      span: 8,
      offset: 4,
    },
    lg: {
      span: 7,
      offset: 4,
    },
  },
};

const AddQuestion = () => {
  const doSubmit = async (values: Record<string, any>) => {
    console.log('values: ', values);
  };

  return (
    <HelmetProvider>
      <Helmet>{<title>{'添加题目'} - 试题君</title>}</Helmet>

      <Card title={'添加题目'}>
        <Row gutter={[24, 24]}>
          <Col lg={16} sm={24}>
            <ProForm
              {...formItemLayout}
              labelAlign='left'
              scrollToFirstError
              initialValues={{
                type: 0,
                difficulty: 0,
              }}
              submitter={false}
              onValuesChange={(value, allValue) => {
                console.log('value, allValue: ', value, allValue);
              }}
              onFinish={doSubmit}
            >
              <ProFormRadio.Group
                label={'题型'}
                name='type'
                options={Object.keys(QUESTION_TYPE_ENUM).map((k) => ({
                  label: QUESTION_TYPE_ENUM[k],
                  value: +k,
                }))}
                rules={[
                  {
                    required: true,
                    message: '请选择题目类型',
                  },
                ]}
              />
              <ProFormRadio.Group
                rules={[
                  {
                    required: true,
                    message: '请选择题目难度',
                  },
                ]}
                label={'难度'}
                name='difficulty'
                options={Object.keys(QUESTION_DIFFICULTY_ENUM).map((k) => ({
                  label: QUESTION_DIFFICULTY_ENUM[k],
                  value: +k,
                }))}
              />
              <ProForm.Item
                name='tags'
                label='标签'
                rules={[
                  {
                    required: true,
                    message: '至少填写 1 个标签',
                  },
                  {
                    max: 5,
                    type: 'array',
                    message: '至多选择 5 个标签',
                  },
                ]}
              >
                <SelectTag />
              </ProForm.Item>

              <ProForm.Item
                label='题目'
                name='title'
                rules={[{ required: true, message: '请输入标题' }]}
              >
                <RichTextEditor placeholder='请输入题目，尽量准确清晰，不用刻意加粗' />
              </ProForm.Item>
              <ProFormDependency name={['type']}>
                {({ type }) => {
                  return (
                    [1, 2, 0].includes(type) && (
                      <ProFormList name='p' label='题目选项' copyIconProps={false} min={1} max={7}>
                        {(f, index, action) => {
                          console.log(f, index, action);
                          return (
                            <>{type === 0 && <ProFormRadio.Group name={['arams', 'answer']} />}</>
                          );
                        }}
                      </ProFormList>
                    )
                  );
                }}
              </ProFormDependency>

              <ProForm.Item label='解析' name='detail'>
                <RichTextEditor placeholder='请输入解析，尽量准确清晰，不用刻意加粗' />
              </ProForm.Item>
              <ProForm.Item
                {...submitFormLayout}
                style={{
                  marginTop: 32,
                }}
              >
                <Button
                  type='primary'
                  htmlType='submit'
                  block
                  // loading={submitting}
                  // disabled={submitting || disabled}
                >
                  {'提交中'}
                </Button>
              </ProForm.Item>
            </ProForm>
          </Col>
        </Row>
      </Card>
    </HelmetProvider>
  );
};

export default AddQuestion;
