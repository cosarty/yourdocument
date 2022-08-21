import { CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { AutoComplete, Input, Space } from 'antd';
import classNames from 'classnames';
import React from 'react';
import { history, useLocation, useSearchParams } from 'umi';
import styles from './index.less';
export type HeaderSearchProps = {
  onChange: (value: string) => void;
  onSearch?: () => void;
  placeholder?: string;
  value?: string;
};

const HeaderSearch: React.FC<HeaderSearchProps> = (props) => {
  const { placeholder, value, onChange, onSearch } = props;
  const { addSearchHistory, searchList, deleteSearchHistory, clearhistory } =
    useModel('searchHistory');
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  /**
   * 清空搜索历史
   */
  const clearAll = () => {
    if (searchList.length > 0) {
      clearhistory();
    }
  };

  /**
   * 删除搜索历史
   * @param e
   * @param text
   */
  const delSearchHistory = (e: React.MouseEvent<HTMLAnchorElement>, text: string) => {
    deleteSearchHistory(text);
    e.stopPropagation();
  };

  /**
   * 渲染搜索历史标题
   */
  const renderSearchHistoryTitle = () => (
    <span>
      搜索历史
      <a style={{ float: 'right' }} onClick={clearAll}>
        <Space>
          <DeleteOutlined />
          清空
        </Space>
      </a>
    </span>
  );
  const renderSearchHistoryItem = (item: string, i: number) => ({
    value: `${item} `,
    label: (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
        key={i}
      >
        {item}
        <a onClick={(e) => delSearchHistory(e, item)} style={{ fontSize: 10 }}>
          <CloseOutlined />
        </a>
      </div>
    ),
  });

  const options = [
    {
      label: renderSearchHistoryTitle(),
      options: searchList.map((s, i) => renderSearchHistoryItem(s, i)),
    },
  ];

  // 搜索事件
  const handleSearch = (name: string) => {
    searchParams.set('q', name);
    if (pathname === '/') {
      history.push({
        pathname: '/',
        search: searchParams.toString(),
      });
    } else {
      window.open(`/questions?q=${name}`);
    }
    onSearch?.();
    addSearchHistory(name);
  };

  return (
    <div className={classNames(styles.headerSearch)}>
      <AutoComplete
        value={value}
        options={options}
        onChange={(v) => {
          if (onChange && v.length < 40) {
            onChange(v);
          }
        }}
        style={{ width: '100%' }}
      >
        <Input.Search
          size='large'
          placeholder={placeholder}
          maxLength={40}
          enterButton
          onSearch={handleSearch}
        />
      </AutoComplete>
    </div>
  );
};

export default HeaderSearch;
