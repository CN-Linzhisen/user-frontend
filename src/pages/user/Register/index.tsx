import Footer from '@/components/Footer';
import { register } from '@/services/ant-design-pro/api';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { message, Tabs } from 'antd';
import React, { useState } from 'react';
import { history, Link, useModel } from 'umi';
import styles from './index.less';

const Register: React.FC = () => {
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };
  const handleSubmit = async (values: API.RegisterParams) => {
    const { userPassword, checkPassword } = values;
    if (userPassword !== checkPassword) {
      message.error('密码与确认密码不匹配');
      return;
    }
    try {
      // 注册
      const id = await register({
        ...values,
        type,
      });
      if (id > 0) {
        const defaultRegisterSuccessMessage = '注册成功！';
        message.success(defaultRegisterSuccessMessage);
        await fetchUserInfo();
        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;
        const { query } = history.location;
        history.push({
          pathname: '/user/login',
          query,
        });
        return;
      } else {
        throw new Error(`register err id = ${id}`);
      }
    } catch (error) {
      const defaultRegisterFailureMessage = '注册失败，请重试！';
      message.error(defaultRegisterFailureMessage);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          submitter={{
            searchConfig: {
              submitText: '用户注册',
            },
          }}
          logo={<img alt="logo" src="/logo.svg" />}
          title="Ant Design"
          subTitle={'Ant Design 是西湖区最具影响力的 Web 设计规范'}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.RegisterParams);
          }}
        >
          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane key="account" tab={'注册'} />
          </Tabs>

          {type === 'account' && (
            <>
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'请输入账号'}
                rules={[
                  {
                    required: true,
                    min: 4,
                    message: '用户名是必填项！(不能小于4位)',
                  },
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'请输入密码'}
                rules={[
                  {
                    required: true,
                    min: 8,
                    type: 'string',
                    message: '密码是必填项！(不能小于8位)',
                  },
                ]}
              />
              <ProFormText.Password
                name="checkPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'请再次确认密码'}
                rules={[
                  {
                    required: true,
                    min: 8,
                    type: 'string',
                    message: '确认密码是必填项！(不能小于8位)',
                  },
                ]}
              />
            </>
          )}
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <Link to={'/user/login'}> 登录 </Link>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};
export default Register;
