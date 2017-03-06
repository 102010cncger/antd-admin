import React, { PropTypes } from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import EitSourceAccountList from '../components/eitSourceAccount/List'
import EitSourceAccountSearch from '../components/eitSourceAccount/Search'
import EitSourceAccountModal from '../components/eitSourceAccount/Modal'

function EitSourceAccount ({ location, dispatch, eitSourceAccount }) {
  const { loading, list, pagination, currentItem, modalVisible, modalType, isMotion } = eitSourceAccount
  const { field, keyword } = location.query

  const eitSourceAccountModalProps = {
    item: modalType === 'create' ? {} : currentItem,
    type: modalType,
    visible: modalVisible,
    onOk (data) {
      dispatch({
        type: `eitSourceAccount/${modalType}`,
        payload: data
      })
    },
    onCancel () {
      dispatch({
        type: 'eitSourceAccount/hideModal'
      })
    }
  }

  const eitSourceAccountListProps = {
    dataSource: list,
    loading,
    pagination: pagination,
    location,
    isMotion,
    onPageChange (page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname: pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize
        }
      }))
    },
    onDeleteItem (id) {
      dispatch({
        type: 'eitSourceAccount/delete',
        payload: id
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'eitSourceAccount/showModal',
        payload: {
          modalType: 'update',
          currentItem: item
        }
      })
    }
  }

  const eitSourceAccountSearchProps = {
    field,
    keyword,
    isMotion,
    onSearch (fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
        pathname: '/eitSourceAccount',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword
        }
      })) : dispatch(routerRedux.push({
        pathname: '/eitSourceAccount'
      }))
    },
    onAdd () {
      dispatch({
        type: 'eitSourceAccount/showModal',
        payload: {
          modalType: 'create'
        }
      })
    },
    switchIsMotion () {
      dispatch({type: 'eitSourceAccount/switchIsMotion'})
    }
  }

  return (
    <div className='content-inner'>
        <EitSourceAccountSearch {...eitSourceAccountSearchProps} />
        <EitSourceAccountList {...eitSourceAccountListProps} />
        <EitSourceAccountModal {...eitSourceAccountModalProps} />
    </div>
  )
}

EitSourceAccount.propTypes = {
  eitSourceAccount: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({eitSourceAccount}) => ({eitSourceAccount}))(EitSourceAccount)

/**
{
  path: 'eitSourceAccount',
  name: 'eitSourceAccount',
  getComponent (nextState, cb) {
    require.ensure([], require => {
      registerModel(app, require('./models/EitSourceAccount'))
      cb(null, require('./routes/EitSourceAccount'))
    })
  }
}
**/