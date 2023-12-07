import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
const Footer: React.FC = () => {
  const defaultMessage = 'CN-Linzhisen';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: '用户管理中心',
          title: '用户管理中心',
          href: 'https://github.com/CN-Linzhisen',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/CN-Linzhisen',
          blankTarget: true,
        },
        {
          key: '用户管理中心',
          title: '用户管理中心',
          href: 'https://github.com/CN-Linzhisen',
          blankTarget: true,
        },
      ]}
    />
  );
};
export default Footer;
