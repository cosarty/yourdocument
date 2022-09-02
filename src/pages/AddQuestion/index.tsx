/* eslint-disable no-param-reassign */
import AddMultipleOptions from '@/components/AddMultipleOptions';
import AddSingleOptions from '@/components/AddSingleOptions';
import RichTextEditor from '@/components/RichTextEditor';
import SelectTag from '@/components/SelectTag';
import { QUESTION_DIFFICULTY_ENUM, QUESTION_TYPE_ENUM } from '@/constant/question';
import { addQuestion, getQuestions, updateQuestion } from '@/services/question';
import { pick } from '@/util/utils';
import type { ProFormInstance } from '@ant-design/pro-components';
import { ProForm, ProFormDependency, ProFormRadio } from '@ant-design/pro-components';
import { history, useOutletContext } from '@umijs/max';
import { Button, Card, Col, message, Row } from 'antd';
import BraftEditor from 'braft-editor';
import { useRef, useState } from 'react';
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
  const cont = useOutletContext<{ edit?: boolean; questionId: string }>() ?? {};

  const { edit = false, questionId } = cont;

  const formRef = useRef<ProFormInstance>();
  const [submitting, setSubmitting] = useState<boolean>(false);

  const doSubmit = async (values: Record<string, any>) => {
    if (values.type === '2') {
      values[`params${values.type}`].answer = values[`params${values.type}`].answer.join(',');
    }

    if (['0', '1', '2'].includes(values.type)) {
      values = pick(values, [
        'detail',
        'difficulty',
        `params${values.type}`,
        'tags',
        'title',
        'type',
      ]);
      // 编码转换
      values[`params${values.type}`].options = Object.fromEntries(
        values[`params${values.type}`].options.map((op: string, index: number) => {
          const letter = String.fromCharCode(65 + index);
          return [letter, op];
        }),
      );
      values.params = values[`params${values.type}`];
    }
    Object.keys(values).map((k: string) => k.search(/params\d/) !== -1 && delete values[k]);

    setSubmitting(true);
    try {
      if (!edit) {
        const { message: msg } = await addQuestion(values);
        history.replace({ pathname: '/' });
        message.success(msg);
      } else {
        values = pick(values, ['type'], true);
        const { data, message: msg } = await updateQuestion(questionId, values);

        history.replace(`/qd/${data?._id}`);
        message.success(msg);
      }
      setSubmitting(false);
    } catch (error) {
      setSubmitting(false);
      message.error('创建失败');
    }
  };

  return (
    <HelmetProvider>
      <Helmet>{<title>{edit ? '编辑题目' : '添加题目'} - 试题君</title>}</Helmet>

      <Card title={edit ? '编辑题目' : '添加题目'}>
        <Row gutter={[24, 24]}>
          <Col lg={16} sm={24}>
            <ProForm
              formRef={formRef}
              {...formItemLayout}
              labelAlign='left'
              scrollToFirstError
              submitter={false}
              request={async () => {
                if (edit && questionId) {
                  const { data, code } = await getQuestions(questionId);

                  data!.type += '';
                  data!.difficulty += '';
                  if (['0', '1', '2'].includes((data?.type as string) ?? '')) {
                    if ((data?.type as string) === '2')
                      data!.params!.answer = (data!.params!.answer as string).split(',');
                    data!.params!.options = Object.values(data!.params!.options ?? {});
                    data!['params' + data!.type] = data!.params;
                  }
                  if (code === 200) {
                    return data ?? {};
                  }

                  return {};
                }
                return { type: '0', difficulty: '0' };
              }}
              onFinish={doSubmit}
            >
              <ProFormRadio.Group
                label={'题型'}
                name='type'
                options={Object.keys(QUESTION_TYPE_ENUM).map((k) => ({
                  label: QUESTION_TYPE_ENUM[k],
                  value: k,
                }))}
                readonly={edit}
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
                  value: k,
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
                rules={[
                  { required: true, message: '请输入标题' },
                  {
                    validator: (_, value) => {
                      if (value && !BraftEditor.createEditorState(value).toText().trim()) {
                        return Promise.reject('标题必须包含文字');
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <RichTextEditor placeholder='请输入题目，尽量准确清晰，不用刻意加粗' />
              </ProForm.Item>
              <ProFormDependency name={['type']}>
                {({ type }) => {
                  return (
                    <>
                      {['1', '2', '0'].includes(type) && (
                        <>
                          {type === '0' && (
                            <ProForm.Item
                              name='params0'
                              label={'题目选项'}
                              shouldUpdate
                              rules={[
                                {
                                  validator: (
                                    _: any,
                                    value: { options: string[]; answer: string },
                                  ) => {
                                    if (!value.answer || !value.options.every((op) => !!op)) {
                                      return Promise.reject('答案和选项不能为空');
                                    }

                                    return Promise.resolve();
                                  },
                                },
                              ]}
                            >
                              <AddSingleOptions min={2} max={2} />
                            </ProForm.Item>
                          )}
                          {type === '1' && (
                            <ProForm.Item
                              name='params1'
                              label={'题目选项'}
                              shouldUpdate
                              rules={[
                                {
                                  validator: (
                                    _: any,
                                    value: { options: string[]; answer: string },
                                  ) => {
                                    if (!value.answer || !value.options.every((op) => !!op)) {
                                      return Promise.reject('答案和选项不能为空');
                                    }

                                    return Promise.resolve();
                                  },
                                },
                              ]}
                            >
                              <AddSingleOptions min={3} max={6} />
                            </ProForm.Item>
                          )}
                          {type === '2' && (
                            <ProForm.Item
                              name='params2'
                              label={'题目选项'}
                              shouldUpdate
                              rules={[
                                {
                                  validator: (
                                    _: any,
                                    value: { options: string[]; answer: string[] },
                                  ) => {
                                    if (
                                      !value.answer.every((op) => !!op) ||
                                      !value.options.every((op) => !!op)
                                    ) {
                                      return Promise.reject('答案和选项不能为空');
                                    }

                                    return Promise.resolve();
                                  },
                                },
                              ]}
                            >
                              <AddMultipleOptions min={4} max={6} />
                            </ProForm.Item>
                          )}
                        </>
                      )}
                      {type === '3' && (
                        <ProForm.Item
                          label='答案'
                          name='reference'
                          rules={[
                            { required: true, message: '答案不能为空' },
                            {
                              validator: (_, value) => {
                                if (
                                  value &&
                                  !BraftEditor.createEditorState(value).toText().trim()
                                ) {
                                  return Promise.reject('答案不能为空');
                                }
                                return Promise.resolve();
                              },
                            },
                          ]}
                        >
                          <RichTextEditor placeholder='请输入解析，尽量准确清晰，不用刻意加粗' />
                        </ProForm.Item>
                      )}
                    </>
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
                  loading={submitting}
                  disabled={submitting}
                >
                  {submitting ? '提交中' : '提交'}
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
