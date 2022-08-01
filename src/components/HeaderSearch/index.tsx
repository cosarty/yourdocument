import { AutoComplete, Input } from 'antd';
import classNames from 'classnames';
import useMergedState from 'rc-util/es/hooks/useMergedState';
import React from 'react';
import styles from './index.less';

export type HeaderSearchProps = {
  onSearch?: (value?: string) => void;
  onChange?: (value?: string) => void;
  onVisibleChange?: (b: boolean) => void;
  className?: string;
  placeholder?: string;
  defaultVisible?: boolean;
  visible?: boolean;

  value?: string;
};

const HeaderSearch: React.FC<HeaderSearchProps> = (props) => {
  const {
    className,

    onVisibleChange,
    placeholder,
    visible,
    defaultVisible,
    ...restProps
  } = props;

  const options = [
    { label: <a href='https://umijs.org/zh/guide/umi-ui.html'>umi ui</a>, value: 'umi ui' },
    {
      label: <a href='next.ant.design'>Ant Design</a>,
      value: 'Ant Design',
    },
  ];

  const [value, setValue] = useMergedState<string | undefined>('', {
    value: props.value,
    onChange: props.onChange,
  });

  return (
    <div className={classNames(className, styles.headerSearch)}>
      <AutoComplete
        value={value}
        options={options}
        onChange={(completeValue) => setValue(completeValue)}
        style={{ width: '100%' }}
      >
        <Input.Search
          size='large'
          placeholder={'题目搜索'}
          enterButton
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (restProps.onSearch) {
                restProps.onSearch(value);
              }
            }
          }}
        />
      </AutoComplete>
    </div>
  );
};

export default HeaderSearch;
