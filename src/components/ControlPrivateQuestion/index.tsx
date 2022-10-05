import { updateQuestionPeivate } from '@/services/question';
import { message, Switch } from 'antd';
import { FC, useState } from 'react';

export type ControlPrivateQuestionProps = {
  value?: boolean;
  onChange?: (v: boolean) => void;
  qustionId?: string;
};

const ControlPrivateQuestionL: FC<ControlPrivateQuestionProps> = (props) => {
  const { value = false, onChange, qustionId } = props;

  const [loading, setLoading] = useState(false);

  const changehandler = async (check: boolean) => {
    if (!qustionId) return onChange?.(check);
    setLoading(true);
    const res = await updateQuestionPeivate(qustionId);
    if (res.code === 202) {
      onChange?.(!!res.data?.isPrivate);
    }
    message.success(res.message);
    setLoading(false);
  };

  return (
    <Switch
      checkedChildren='公开'
      unCheckedChildren='私有'
      loading={loading}
      checked={value}
      onChange={changehandler}
    />
  );
};

export default ControlPrivateQuestionL;
