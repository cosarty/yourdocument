/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import AddMultipleOptions from '@/components/AddMultipleOptions';
import AddSingleOptions from '@/components/AddSingleOptions';
import ControlPrivateQuestion from '@/components/ControlPrivateQuestion';
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
        'isPrivate',
      ]);
      // ????????????
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

        // history.replace(`/qd/${data?._id}`);
        history.go(-1);
        message.success(msg);
      }
      setSubmitting(false);
    } catch (error) {
      setSubmitting(false);
      message.error('????????????');
    }
  };

  return (
    <HelmetProvider>
      <Helmet>{<title>{edit ? '????????????' : '????????????'} - ?????????</title>}</Helmet>

      <Card title={edit ? '????????????' : '????????????'}>
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
                return { type: '0', difficulty: '0', isPrivate: false };
              }}
              onFinish={doSubmit}
            >
              <ProFormRadio.Group
                label={'??????'}
                name='type'
                options={Object.keys(QUESTION_TYPE_ENUM).map((k) => ({
                  label: QUESTION_TYPE_ENUM[k],
                  value: k,
                }))}
                readonly={edit}
                rules={[
                  {
                    required: true,
                    message: '?????????????????????',
                  },
                ]}
              />
              <ProFormRadio.Group
                rules={[
                  {
                    required: true,
                    message: '?????????????????????',
                  },
                ]}
                label={'??????'}
                name='difficulty'
                options={Object.keys(QUESTION_DIFFICULTY_ENUM).map((k) => ({
                  label: QUESTION_DIFFICULTY_ENUM[k],
                  value: k,
                }))}
              />
              <ProForm.Item
                name='tags'
                label='??????'
                rules={[
                  {
                    required: true,
                    message: '???????????? 1 ?????????',
                  },
                  {
                    max: 5,
                    type: 'array',
                    message: '???????????? 5 ?????????',
                  },
                ]}
              >
                <SelectTag />
              </ProForm.Item>

              <ProForm.Item
                label='??????'
                name='title'
                rules={[
                  { required: true, message: '???????????????' },
                  {
                    validator: (_, value) => {
                      if (value && !BraftEditor.createEditorState(value).toText().trim()) {
                        return Promise.reject('????????????????????????');
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <RichTextEditor placeholder='?????????????????????????????????????????????????????????' />
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
                              label={'????????????'}
                              shouldUpdate
                              rules={[
                                {
                                  validator: (
                                    _: any,
                                    value: { options: string[]; answer: string },
                                  ) => {
                                    if (!value.answer || !value.options.every((op) => !!op)) {
                                      return Promise.reject('???????????????????????????');
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
                              label={'????????????'}
                              shouldUpdate
                              rules={[
                                {
                                  validator: (
                                    _: any,
                                    value: { options: string[]; answer: string },
                                  ) => {
                                    if (!value.answer || !value.options.every((op) => !!op)) {
                                      return Promise.reject('???????????????????????????');
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
                              label={'????????????'}
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
                                      return Promise.reject('???????????????????????????');
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
                          label='??????'
                          name='reference'
                          rules={[
                            { required: true, message: '??????????????????' },
                            {
                              validator: (_, value) => {
                                if (
                                  value &&
                                  !BraftEditor.createEditorState(value).toText().trim()
                                ) {
                                  return Promise.reject('??????????????????');
                                }
                                return Promise.resolve();
                              },
                            },
                          ]}
                        >
                          <RichTextEditor placeholder='?????????????????????????????????????????????????????????' />
                        </ProForm.Item>
                      )}
                    </>
                  );
                }}
              </ProFormDependency>

              <ProForm.Item label='??????' name='detail'>
                <RichTextEditor placeholder='?????????????????????????????????????????????????????????' />
              </ProForm.Item>
              <ProForm.Item
                label='??????'
                name='isPrivate'
                rules={[{ required: true, message: '???????????????' }]}
              >
                <ControlPrivateQuestion />
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
                  {submitting ? '?????????' : '??????'}
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
