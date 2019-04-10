import { connect } from 'dva';
import { Table, Pagination, Popconfirm, Button } from 'antd';
import { routerRedux } from 'dva/router';
import UserModal from './UserModal';
import styles from './Users.css';
import { PAGE_SIZE } from '../constants';

function Users({ dispatch, list: dataSource, total, page: current, loading }) {
  function createHandler(values) {
    dispatch({
      type: 'users/create',
      payload: values
    });
  }

  function deleteHandler(id) {
    // console.warn(`TODO: ${id}`);
    dispatch({
      type: 'users/remove',
      payload: id
    });
  }

  function pageChangeHandler(page) {
    // console.log('page>>>', page);
    dispatch(
      routerRedux.push({
        pathname: '/users',
        query: {
          page
        }
      })
    );
  }

  function editHandler(id, values) {
    dispatch({
      type: 'users/patch',
      payload: { id, values }
    });
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: text => <a href=''>{text}</a>
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Website',
      dataIndex: 'website',
      key: 'website'
    },
    {
      title: 'Operation',
      key: 'operation',
      render: (text, record) => (
        <span className={styles.operation}>
          <UserModal record={record} onOk={editHandler.bind(null, record.id)}>
            <a href=''>Edit</a>
          </UserModal>
          <Popconfirm title='Confirm to delete?' onConfirm={deleteHandler.bind(null, record.id)}>
            <a href=''>Delete</a>
          </Popconfirm>
        </span>
      )
    }
  ];

  return (
    <div className={styles.normal}>
      <div>
        <div className={styles.create}>
          <UserModal record={{}} onOk={createHandler}>
            <Button type='primary'>Create User</Button>
          </UserModal>
        </div>
        <Table
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          rowKey={record => record.id}
          pagination={false}
          // pagination={{
          //   total,
          //   current,
          //   pageSize: PAGE_SIZE
          // }}
        />
        <Pagination
          className='ant-table-pagination'
          total={total}
          current={current}
          pageSize={PAGE_SIZE}
          onChange={pageChangeHandler}
        />
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  const { list, total, page } = state.users;
  return {
    list,
    total,
    page,
    loading: state.loading.models.users
  };
}

export default connect(mapStateToProps)(Users);
