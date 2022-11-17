import { Card } from 'antd';
import { useRef, useState } from 'react';
import type { MyCreateOegizeRefType } from './MyCreate';
import MyCreate from './MyCreate';
import ApplyOrange from './MyCreate/ApplyOrange';
import CreateOegize from './MyCreate/CreateOrEditOegize';
import MyPass from './MyPass';

const tabList = [
  {
    key: 'create',
    tab: '我创建的',
    componet: (props: any) => <MyCreate {...props} />,
  },
  {
    key: 'pass',
    tab: '我加入的',
    componet: (props: any) => <MyPass {...props} />,
  },
];

const Orgniza = () => {
  const myCreateref = useRef<MyCreateOegizeRefType>();

  const [activeTabKey, setActiveTabKey] = useState<'create' | 'pass'>('create');

  const checkProps = {
    create: {
      ref: myCreateref,
    },
    pass: {},
  };

  const onTabChange = (key: string) => {
    setActiveTabKey(key as 'create' | 'pass');
  };

  return (
    <Card
      tabList={tabList}
      title={false}
      extra={
        <>
          <ApplyOrange />,
          <CreateOegize
            onFinish={() => {
              myCreateref.current?.reload();
            }}
            edit={false}
          />
        </>
      }
      activeTabKey={activeTabKey}
      onTabChange={(key: string) => {
        onTabChange(key);
      }}
    >
      {tabList.find((av) => av.key === activeTabKey)?.componet(checkProps[activeTabKey])}
    </Card>
  );
};

export default Orgniza;
