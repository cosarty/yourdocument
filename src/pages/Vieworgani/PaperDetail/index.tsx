import { Button, Divider, Dropdown, Empty, Menu, Typography } from 'antd';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import styles from './index.less';
interface PaperDetailProps {
  paperId?: string;
}

const PaperDetail: FC<PaperDetailProps> = ({ paperId }) => {
  const [showReference, setShowReference] = useState<boolean>(true);
  useEffect(() => {
    console.log(paperId);
  }, [paperId]);

  const opMenu = (
    <Menu>
      <Menu.Item onClick={() => setShowReference(!showReference)}>
        {showReference ? '隐藏' : '显示'}解析
      </Menu.Item>
      <Menu.Item onClick={() => {}}>下载试卷</Menu.Item>
    </Menu>
  );

  return (
    <>
      {paperId ? (
        <>
          <div className={styles['contaner']}>
            <div className={styles['action']}>
              <Typography.Title level={4}>{'test'}</Typography.Title>
              <Dropdown overlay={opMenu}>
                <Button>操作</Button>
              </Dropdown>
            </div>

            <Divider />
            <div>
              gjfldjglkdjgldjgfdlklkljgkgljgkldjgm gjfldjglkdjgldjgfdlklkljgkgljgkldjgmnb
              gjfldjglkdjgldjgfdlklkljgkgljgkldjgmnb gjfldjglkdjgldjgfdlklkljgkgljgkldjgmnb
              gjfldjglkdjgldjgfdlklkljgkgljgkldjgmnb gjfldjglkdjgldjgfdlklkljgkgljgkldjgmnb
              gjfldjglkdjgldjgfdlklkljgkgljgkldjgmnb gjfldjglkdjgldjgfdlklkljgkgljgkldjgmnb
              gjfldjglkdjgldjgfdlklkljgkgljgkldjgmnb gjfldjglkdjgldjgfdlklkljgkgljgkldjgmnb
              gjfldjglkdjgldjgfdlklkljgkgljgkldjgmnb gjfldjglkdjgldjgfdlklkljgkgljgkldjgmnb
              gjfldjglkdjgldjgfdlklkljgkgljgkldjgmnb gjfldjglkdjgldjgfdlklkljgkgljgkldjgmnb
              gjfldjglkdjgldjgfdlklkljgkgljgkldjgmnb gjfldjglkdjgldjgfdlklkljgkgljgkldjgmnb
              gjfldjglkdjgldjgfdlklkljgkgljgkldjgmnb gjfldjglkdjgldjgfdlklkljgkgljgkldjgmnb
              gjfldjglkdjgldjgfdlklkljgkgljgkldjgmnb gjfldjglkdjgldjgfdlklkljgkgljgkldjgmnb
              gjfldjglkdjgldjgfdlklkljgkgljgkldjgmnb gjfldjglkdjgldjgfdlklkljgkgljgkldjgmnb
              gjfldjglkdjgldjgfdlklkljgkgljgkldjgmnb gjfldjglkdjgldjgfdlklkljgkgljgkldjgmnb
              gjfldjglkdjgldjgfdlklkljgkgljgkldjgmnb gjfldjglkdjgldjgfdlklkljgkgljgkldjgmnb
              gjfldjglkdjgldjgfdlklkljgkgljgkldjgmnb gjfldjglkdjgldjgfdlklkljgkgljgkldjgmnb
              gjfldjglkdjgldjgfdlklkljgkgljgkldjgmnb nb,cnb,cbn,c
            </div>
          </div>
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
