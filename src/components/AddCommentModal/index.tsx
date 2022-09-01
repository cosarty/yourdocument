import { addComment, CommentType } from '@/services/comment';
import { EditOutlined } from '@ant-design/icons';
import { ModalForm, ProForm, ProFormInstance } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import BraftEditor from 'braft-editor';
import { FC, useRef } from 'react';
import RichTextEditor from '../RichTextEditor';

interface AddCommentModalProps {
  questionId?: string;
  commentId?: string;
  edit?: boolean;
  onReload?: (comment: CommentType) => void;
  content?: string;
}

const AddCommentModal: FC<AddCommentModalProps> = ({
  questionId,
  onReload,
  edit,
  content = '',
}) => {
  const formRef = useRef<ProFormInstance>();
  return (
    <ModalForm<{
      content: string;
    }>
      formRef={formRef}
      title={<>评论</>}
      trigger={
        !edit ? (
          <Button type='primary'>
            <EditOutlined />
            <span>评论</span>
          </Button>
        ) : (
          <span>编辑</span>
        )
      }
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log('run'),
        width: 500,
      }}
      initialValues={{ content }}
      submitTimeout={2000}
      onFinish={async (values) => {
        const data = await addComment({ questionId: questionId ?? '', content: values.content });

        if (data.code) {
          onReload?.(data?.data ?? ({} as any));
          message.success('评论成功！！');
        } else {
          message.error('评论失败！！');
        }
        return true;
      }}
    >
      {
        <ProForm.Item
          name={'content'}
          rules={[
            { required: true, message: '评论不能为空' },
            {
              validator: (_, value) => {
                if (value && !BraftEditor.createEditorState(value).toText().trim()) {
                  return Promise.reject('评论不能为空');
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <RichTextEditor placeholder='请输入评论内容' />
        </ProForm.Item>
      }
    </ModalForm>
  );
};

export default AddCommentModal;
