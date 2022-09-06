import type { TagsType } from '@/services/tags';
import { delTags, getTags, updateTags } from '@/services/tags';
import { CloseOutlined, FolderAddOutlined } from '@ant-design/icons';
import { Button, Card, Input, message, Modal, Popconfirm, Tabs, Tag } from 'antd';
import { useEffect, useState } from 'react';

const MangeTags = () => {
  const [tags, setTags] = useState<TagsType[]>([]);
  const [activeKey, setActiveKey] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [textValue, setTextValue] = useState('');
  const [tagValue, setTagValue] = useState('');

  const doTags = async () => {
    const res = await getTags();
    if (res.code === 200) {
      console.log('res.data : ', res.data);
      setTags(res.data ?? []);
    }
  };

  const delTag = async (moduel: string, tag?: string) => {
    const sul = {} as { name: string; tags: string[] };
    if (!moduel) return;
    sul.name = moduel;
    if (tag) sul.tags = [tag];

    const data = await delTags(sul);
    if (data.code === 202) {
      message.success(data.message);
      if (activeKey === moduel && !tag) {
        setActiveKey('');
      }

      await doTags();
    }
  };

  const renderTags = (moduel: string, tag: string[]) =>
    tag.map((t) => (
      <Tag
        key={t}
        closable
        onClose={(e) => {
          e.preventDefault();
          delTag(moduel, t);
        }}
      >
        {t}
      </Tag>
    ));

  const renderModule = () =>
    tags.map(({ name, tags: tag }) => (
      <Tabs.TabPane
        tab={
          <span style={{ cursor: 'text' }}>
            {name}
            <Popconfirm
              title='是否删除模块，删除后无法恢复?'
              onConfirm={() => {
                delTag(name);
              }}
              okText='确认'
              cancelText='  取消'
            >
              <CloseOutlined style={{ marginLeft: '10px', cursor: 'pointer' }} />
            </Popconfirm>
          </span>
        }
        key={name}
      >
        {renderTags(name, tag)}
        <Popconfirm
          title={
            <Input
              value={tagValue}
              onChange={(e) => {
                setTagValue(e.target.value);
              }}
              placeholder='请输入表标签名'
              style={{ marginLeft: '-10px' }}
            />
          }
          okText='是'
          cancelText='否'
          icon={false}
          onConfirm={async () => {
            if (!tagValue) {
              return;
            }
            await updateTags({ name, tags: [tagValue] });
            await doTags();
            message.success('更新成功!!');
          }}
          onVisibleChange={(vis) => {
            if (!vis) {
              setTimeout(() => {
                setTagValue('');
              }, 50);
            }
          }}
        >
          <Tag color='geekblue'>
            <FolderAddOutlined />
          </Tag>
        </Popconfirm>
      </Tabs.TabPane>
    ));

  useEffect(() => {
    doTags();
  }, []);

  const handleOk = async () => {
    await updateTags({ name: textValue });
    await doTags();
    setIsModalOpen(false);
    message.success('创建成功!!!');
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setTextValue('');
  };

  return (
    <Card
      title='标签管理'
      extra={
        <Button
          type='link'
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          添加模块
        </Button>
      }
    >
      <Tabs
        activeKey={activeKey}
        onChange={(key: string) => {
          setActiveKey(key);
        }}
      >
        {renderModule()}
      </Tabs>
      <Modal title='添加模块' visible={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Input
          value={textValue}
          onChange={(v) => {
            setTextValue(v.target.value);
          }}
          placeholder='请输入模块名'
        />
      </Modal>
    </Card>
  );
};

export default MangeTags;
