import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';

const Footer: React.FC = () => {
  const defaultMessage = '江航出品';

  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: '试题君',
          title: '试题君',
          href: '/',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/',
          blankTarget: true,
        },
        // {
        //   key: 'Ant Design',
        //   title: 'Ant Design',
        //   href: 'https://ant.design',
        //   blankTarget: true,
        // },
      ]}
    />
  );
};

export default Footer;
