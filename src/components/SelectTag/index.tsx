import { getTags } from '@/services/tags';
import { message, Select, Tabs, Tag } from 'antd';
import type { CSSProperties, FC, ReactNode } from 'react';
import { useEffect, useState } from 'react';
interface SelectTagsProps {
  mode?: 'multiple' | 'tags';
  disabled?: boolean;
  value?: string[];
  onChange?: (tags: string[]) => void;
  tagLoading?: boolean;
  maxTagsNumber?: number;
  placeholder?: string;
  style?: CSSProperties;
  showEmty?: boolean;
}

const SelectTag: FC<SelectTagsProps> = (props) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [tagsAll, setTagsAll] = useState<API.TagAll>([]);

  useEffect(() => {
    getTags().then((tags) => {
      setTagsAll(tags);
    });
  }, []);

  const {
    disabled = false,
    onChange,
    value = [],
    tagLoading,
    maxTagsNumber = 5,
    placeholder,
    style,
    mode = 'multiple',
    showEmty = false,
  } = props;

  const handleChange = (tag: any, checked: any) => {
    const nextSelectedTags = checked ? [...value, tag] : value.filter((t) => t !== tag);
    if (nextSelectedTags.length > maxTagsNumber) {
      message.warning(`最多只能选择 ${maxTagsNumber} 个标签！`);
      return;
    }
    onChange?.(nextSelectedTags);
  };

  const groupTagsView =
    tagsAll &&
    tagsAll.map((groupTag) => {
      const isShow = groupTag.tags.length === 0 && showEmty;
      return (
        (groupTag.tags.length > 0 || isShow) && (
          <Tabs.TabPane tab={groupTag.name} key={groupTag.name}>
            {groupTag.tags.map((tag) => {
              return (
                <Tag.CheckableTag
                  key={tag}
                  checked={value.indexOf(tag) > -1}
                  onChange={(checked) => handleChange(tag, checked)}
                >
                  {tag}
                </Tag.CheckableTag>
              );
            })}
          </Tabs.TabPane>
        )
      );
    });

  return (
    <Select
      style={{ ...style }}
      loading={tagLoading}
      showSearch
      mode={mode}
      onSearch={(val) => setSearchValue(val)}
      value={value}
      onChange={(v: string[]) => {
        setSearchValue('');
        onChange?.(v);
      }}
      dropdownRender={(menu: ReactNode) => {
        return (
          <>
            {searchValue.length > 0 ? (
              menu
            ) : (
              <div style={{ paddingLeft: '10px' }}>
                <Tabs>{groupTagsView}</Tabs>
              </div>
            )}
          </>
        );
      }}
      disabled={disabled}
      placeholder={placeholder ?? `可选至多 ${maxTagsNumber} 个标签，支持搜索`}
    >
      {tagsAll &&
        tagsAll.flatMap(({ tags }) => {
          return tags.map((tag) => (
            <Select.Option key={tag} value={tag}>
              {tag}
            </Select.Option>
          ));
        })}
    </Select>
  );
};

export default SelectTag;
