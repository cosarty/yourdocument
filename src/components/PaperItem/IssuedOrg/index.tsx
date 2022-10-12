import type { OrganizeType } from '@/services/organize';
import { getSelfOrgnize, viewPaper } from '@/services/organize';
import { issuedPaper } from '@/services/paper';
import { Button, message, Modal, Skeleton } from 'antd';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

type IssuedOrgProps = {
  paperId: string;
};

const IssuedOrg: FC<IssuedOrgProps> = ({ paperId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [myOrg, setMyorg] = useState<OrganizeType[]>([]);

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const doData = async () => {
    const { data } = await getSelfOrgnize();
    // 合并请求合成试卷
    await Promise.all(
      (data?.organizes ?? []).map(async (or, idx) => {
        const { data: paperInfo } = await viewPaper(or._id);
        if (paperInfo!.length > 0) data!.organizes[idx].papers = paperInfo!;
      }),
    );
    // viewPaper
    setMyorg(data?.organizes ?? []);
  };

  const issuedOg = async (ogid: string) => {
    const { message: ms } = await issuedPaper(paperId, ogid);
    await doData();
    message.success(ms);
  };

  const checkIssued = (ogid: string) => {
    const og = myOrg.find((o) => o._id === ogid);
    if (og) return !!og.papers?.find((p) => paperId === p.papersId._id);

    return false;
  };

  useEffect(() => {
    if (isModalOpen) {
      doData();
    } else {
      setMyorg([]);
    }
  }, [isModalOpen]);

  return (
    <>
      <Button
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        下发
      </Button>
      <Modal title='试卷下发' visible={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        {myOrg.length === 0 ? (
          <Skeleton />
        ) : (
          myOrg.map((og) => (
            <p key={og._id}>
              <span>
                {og.name}({og.motto})
              </span>
              <Button
                type='link'
                onClick={() => {
                  issuedOg(og._id);
                }}
                danger={checkIssued(og._id)}
              >
                {checkIssued(og._id) ? '取消下发' : '下发组织'}
              </Button>
            </p>
          ))
        )}
      </Modal>
    </>
  );
};

export default IssuedOrg;
