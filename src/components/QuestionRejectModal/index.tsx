import { AutoComplete, message, Modal } from 'antd';
import React, { useState } from 'react';
import { useAccess } from 'umi';

interface QuestionRejectModalProps {
  questionId: string;
  visible: boolean;
  onSucceed?: (message: string | undefined) => void;
  onClose: () => void;
}

/**
 * 题目拒绝模态框
 * @param props
 * @constructor
 */
const QuestionRejectModal: React.FC<QuestionRejectModalProps> = (props) => {
  const { visible, questionId, onClose, onSucceed } = props;

  const [reviewMessage, setReviewMessage] = useState<string>();

  const access = useAccess();

  const doSubmit = async () => {
    // 仅管理员可操作
    if (!access.canAdmin) {
      message.warning('请先登录');
      return;
    }
    if (!questionId) {
      return;
    }
    // 执行操作

    onSucceed?.(reviewMessage);
    onClose();
  };

  return (
    <Modal
      title='请输入拒绝原因'
      visible={visible}
      onOk={doSubmit}
      onCancel={() => {
        setReviewMessage('');
        onClose();
      }}
      destroyOnClose
    >
      <AutoComplete
        options={[
          { value: '已有相同题目' },
          { value: '题目信息不完整' },
          { value: '题目标签不正确' },
          { value: '涉嫌引流，请联系微信 code_nav' },
        ]}
        style={{ width: '100%' }}
        placeholder='请输入拒绝原因'
        value={reviewMessage}
        onChange={(data) => setReviewMessage(data)}
      />
    </Modal>
  );
};

export default QuestionRejectModal;
