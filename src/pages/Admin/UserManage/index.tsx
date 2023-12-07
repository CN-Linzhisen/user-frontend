import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { deleteUserPOST, searchUsers } from '@/services/ant-design-pro/api';
import { useRef } from 'react';
import { useModel } from '@@/plugin-model/useModel';

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
    render: (_, record) => (
      <div>
        <img src={record.userAvatar} width={50} alt={'用户头像'} />
      </div>
    ),
  },
  {
    title: '性别',
    dataIndex: 'gender',
    search: false,
    copyable: true,
    valueType: 'select',
    valueEnum: {
      0: { text: '男', status: 'Default' },
      1: { text: '女', status: 'Success' },
    },
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
    title: '用户角色',
    dataIndex: 'userRole',
    search: false,
    valueType: 'select',
    valueEnum: {
      0: { text: '普通用户', status: 'Default' },
      1: { text: '管理员', status: 'Success' },
    },
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={async (key) => {
          console.log(record.id);
          console.log(record);
          await deleteUserPOST({ id: record.id });
          // 自动刷新
          action?.reload();
        }}
      >
        删除
      </a>,
    ],
  },
];

export default () => {
  const actionRef = useRef<ActionType>();
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState ?? {};
  return (
    <ProTable<API.CurrentUser>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      // TODO
      // @ts-ignore
      request={async (params: API.UserQueryParams, filter) => {
        // 表单搜索项会从 params 传入，传递给后端接口。
        const res = await searchUsers(params);
        // @ts-ignore
        // 返回的全部用户
        const arr = [...res.data];
        // 过滤掉当前用户
        const FilterData = arr.filter((item) => item.id !== currentUser?.id);
        return {
          data: FilterData,
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
      toolBarRender={() => []}
    ></ProTable>
  );
};
