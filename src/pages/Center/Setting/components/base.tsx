import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import styles from './BaseView.less';
import { useModel } from '@@/plugin-model/useModel';
import { RcFile } from 'antd/es/upload';
import { updateMyAvatarPOST, updateMyUser } from '@/services/ant-design-pro/api';
import { ProFormRadio } from '@ant-design/pro-components';

/**
 * 上传图片前对图片的格式和大小进行校验
 */
const beforeUpload = async (file: RcFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('头像仅支持jpg/jpeg和png格式');
  }
  // 上传的文件不能超过2MB
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('上传的图片不能超过2MB');
  }
  return isJpgOrPng && isLt2M;
};

// 头像组件 方便以后独立，增加裁剪之类的功能

const BaseView: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser } = initialState ?? {};
  const [loading] = useState(false);
  const fetchUserInfo = async () => {
    const user = await initialState?.fetchUserInfo?.();
    setInitialState((s) => ({
      ...s,
      currentUser: user,
    }));
  };
  const getAvatarURL = () => {
    if (currentUser) {
      if (currentUser.userAvatar) {
        return currentUser.userAvatar;
      }
      const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
      return url;
    }
    return '';
  };
  /**
   * 更换头像
   * @param options
   */
  const updateMyAvatar = async (options: any) => {
    const { file } = options;
    try {
      // 更换头像
      const res = await updateMyAvatarPOST({}, file);
      if (res?.data) {
        await fetchUserInfo();
        const defaultSuccessMessage = '修改成功';
        message.success(defaultSuccessMessage);
      }
    } catch (error) {
      const defaultFailureMessage = '修改失败';
      console.log(error);
      message.error(defaultFailureMessage);
    }
  };
  // 头像组件
  const AvatarView = ({ avatar }: { avatar: string }) => (
    <>
      <div className={styles.avatar_title}>头像</div>
      <div className={styles.avatar}>
        <img src={avatar} alt="avatar" />
      </div>
      <Upload
        name="file"
        className="avatar-uploader"
        showUploadList={false}
        beforeUpload={beforeUpload}
        customRequest={updateMyAvatar}
      >
        <div className={styles.button_view}>
          <Button>
            <UploadOutlined />
            更换头像
          </Button>
        </div>
      </Upload>
    </>
  );
  const handleFinish = async (values: API.UpdateMyParams) => {
    console.log(values);
    const res = await updateMyUser({
      ...values,
    });
    await fetchUserInfo();
    console.log(res);
    message.success('更新基本信息成功');
  };

  return (
    <div className={styles.baseView}>
      {loading ? null : (
        <>
          <div className={styles.left}>
            <ProForm
              layout="vertical"
              onFinish={async (values) => {
                await handleFinish(values as API.UpdateMyParams);
              }}
              submitter={{
                searchConfig: {
                  submitText: '更新基本信息',
                },
                render: (_, dom) => dom[1],
              }}
              initialValues={{
                ...currentUser,
              }}
            >
              <ProFormText
                width="md"
                name="userName"
                label="昵称"
                rules={[
                  {
                    required: true,
                    message: '请输入您的昵称!',
                  },
                ]}
              />
              <ProFormRadio.Group
                name="gender"
                label="性别"
                options={[
                  {
                    label: '男',
                    value: 0,
                  },
                  {
                    label: '女',
                    value: 1,
                  },
                ]}
                rules={[
                  {
                    required: true,
                    message: '请选择你的性别',
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="email"
                label="邮箱"
                rules={[
                  {
                    required: true,
                    message: '请输入您的邮箱!',
                  },
                ]}
              />
              <ProFormText
                name="phone"
                label="联系电话"
                rules={[
                  {
                    required: true,
                    message: '请输入您的联系电话!',
                  },
                ]}
              ></ProFormText>
            </ProForm>
          </div>
          <div className={styles.right}>
            <AvatarView avatar={getAvatarURL()} />
          </div>
        </>
      )}
    </div>
  );
};

export default BaseView;
