import { USER_GENDER_ENUM } from '@/constant/user';
import { applyList } from '@/services/organize';
import type { CurrentUser } from '@/services/users';
import { Avatar, Button, Modal } from 'antd';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

interface ApprovalProps {
  refresh: () => void;
  organizeId: string;
}

const Approval: FC<ApprovalProps> = ({ refresh, organizeId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passUserList, setPassUserList] = useState<CurrentUser[]>([]);

  const doData = async () => {
    const { data, code } = await applyList(organizeId);
    if (code === 200) {
      setPassUserList(data?._id ? [...data?.part] : []);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      doData();
    } else {
      setPassUserList([]);
    }
  }, [isModalOpen]);

  return (
    <>
      <Button
        type='primary'
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        审批
      </Button>
      <Modal
        title='试卷下发'
        visible={isModalOpen}
        onOk={() => {
          setIsModalOpen(false);
        }}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        {passUserList.map((pass) => (
          <p key={pass._id}>
            <Avatar src={pass.avtar_url} style={{ marginRight: 10 }} />
            <span style={{ fontWeight: 700, fontSize: 20, marginRight: 10 }}>{pass.nickname}</span>
            <span style={{ fontWeight: 700 }}>({USER_GENDER_ENUM[pass.gender]})</span>
            <Button type='link' onClick={() => {}} s>
              通过
            </Button>
            <Button type='link' onClick={() => {}} danger>
              拒绝
            </Button>
          </p>
        ))}
      </Modal>
    </>
  );
};

export default Approval;
