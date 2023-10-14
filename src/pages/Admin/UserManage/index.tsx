import { DownOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import { searchUsers } from '@/services/ant-design-pro/api';
import { useRef } from 'react';

const columns: ProColumns<API.CurrentUser>[] = [
  {
    dataIndex: 'id',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '用户名',
    dataIndex: 'userName',
    copyable: true,
  },
  {
    title: '账号',
    dataIndex: 'userAccount',
    copyable: true,
  },
  {
    title: '头像',
    search: false,
    dataIndex: 'userAvatar',
    // render: (_, record) => (
    //   <div>
    //     <Image src={record.userAvatar} width={100}/>
    //   </div>
    // ),
  },
  {
    title: '性别',
    dataIndex: 'gender',
    copyable: true,
  },
  {
    title: '电话',
    dataIndex: 'phone',
    copyable: true,
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    copyable: true,
  },
  {
    title: '用户状态',
    dataIndex: 'userStatus',
  },
  {
    title: '用户角色',
    dataIndex: 'userRole',
    valueType: 'select',
    valueEnum: {
      0: { text: '普通用户', status: 'Default' },
      1: { text: '管理员', status: 'Success' },
    },
  },
];

export default () => {
  const actionRef = useRef<ActionType>();
  return (
    <ProTable<API.CurrentUser>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params = {}, filter) => {
        // 表单搜索项会从 params 传入，传递给后端接口。
        const userList = await searchUsers();
        return {
          data: userList,
        };
      }}
      rowKey="key"
      pagination={{
        showQuickJumper: true,
      }}
      search={{
        optionRender: false,
        collapsed: false,
      }}
      dateFormatter="string"
      headerTitle="表格标题"
      toolBarRender={() => [
        <Button key="show">查看日志</Button>,
        <Button key="out">
          导出数据
          <DownOutlined />
        </Button>,
        <Button type="primary" key="primary">
          创建应用
        </Button>,
      ]}
    ></ProTable>
  );
};
