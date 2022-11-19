import QuestionDetailCard from '@/components/QuestionDetailCard';
import type { PaperInfo } from '@/services/organize';
import { getPaperOgInfo } from '@/services/organize';
import { exportPDF } from '@/util/exprotPDF';
import type { MenuProps } from 'antd';
import { Button, Divider, Dropdown, Empty, List, Menu, Spin } from 'antd';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import styles from './index.less';
interface PaperDetailProps {
  paperId: string;
  organizeId: string;
  reset: () => void;
}

const PaperDetail: FC<PaperDetailProps> = ({ paperId, reset, organizeId }) => {
  const [showReference, setShowReference] = useState<boolean>(true);
  const [paperInfo, setPaperInfo] = useState<PaperInfo>({});
  const [loading, setLoading] = useState<boolean>(false);

  const getPaper = async () => {
    setLoading(true);
    const { data, code } = await getPaperOgInfo(organizeId, paperId);
    if (code === 200) {
      setPaperInfo({ ...data } ?? {});
    }
    setLoading(false);
  };

  useEffect(() => {
    if (organizeId && paperId) {
      getPaper();
    } else {
      setPaperInfo({});
    }
  }, [paperId]);

  const onClick: MenuProps['onClick'] = (e) => {
    switch (e.key) {
      case 'show':
        setShowReference(!showReference);
        break;
      case 'download':
        exportPDF(paperInfo.paper?.name || '试卷', 'paper_pd');
        break;
      case 'reset':
        reset();
        break;
    }
  };
  const opMenu = (
    <Menu
      onClick={onClick}
      items={[
        { label: `${showReference ? '隐藏' : '显示'}解析`, key: 'show' },
        { label: '下载试卷', key: 'download' },
        { label: '取消', key: 'reset' },
      ]}
    />
  );

  return (
    <>
      {paperId ? (
        <>
          {loading ? (
            <Spin />
          ) : (
            <div className={styles['contaner']}>
              <div className={styles['action']}>
                <div className={styles['title']}>
                  <div>{paperInfo.paper?.name}</div>
                  <div>({paperInfo.paper?.questions.reduce((p, n) => p + n.grade || 0, 0)}分)</div>
                </div>
                <Dropdown overlay={opMenu}>
                  <Button>操作</Button>
                </Dropdown>
              </div>

              <Divider />
              <List
                id='paper_pd'
                rowKey='_id'
                itemLayout='vertical'
                dataSource={paperInfo?.questionInfo ?? []}
                pagination={false}
                style={{ paddingLeft: 20 }}
                split
                renderItem={(question, index) => {
                  return (
                    <List.Item key={question._id}>
                      <QuestionDetailCard
                        question={question}
                        showReference={showReference}
                        showIndex
                        index={index + 1}
                        grad={
                          paperInfo.paper?.questions.find((q) => q.question === question._id)?.grade
                        }
                      />
                    </List.Item>
                  );
                }}
              />
            </div>
          )}
        </>
      ) : (
        <div className={styles['emty']}>
          <Empty description='请在左侧选择要查看的试卷' />
        </div>
      )}
    </>
  );
};

export default PaperDetail;
