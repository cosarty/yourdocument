import { AutoComplete, Input } from 'antd';
import classNames from 'classnames';
import React from 'react';
import styles from './index.less';

export type HeaderSearchProps = {
  onChange: (value: string) => void;
  placeholder?: string;
  value?: string;
};

const HeaderSearch: React.FC<HeaderSearchProps> = (props) => {
  const { placeholder, value, onChange } = props;
  // const {} = useModel('searchHistory');
  const options = [
    { label: <a href='https://umijs.org/zh/guide/umi-ui.html'>umi ui</a>, value: 'umi ui' },
    {
      label: <a href='next.ant.design'>Ant Design</a>,
      value: 'Ant Design',
    },
  ];

  const handleSearch = (name: string) => {
    console.log('name: ', name);
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
