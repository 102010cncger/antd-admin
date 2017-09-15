/* global window */
/* global document */
/* global location */
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import config from 'config'
import { EnumRoleType } from 'enums'
import { query, logout } from 'services/app'
import * as menusService from 'services/menus'
import queryString from 'query-string'
import React from 'react';

const { prefix } = config

export default {
  namespace: 'app',
  state: {
    user: {},
    permissions: {
      visit: [],
    },
    menu: [
      {
        id: 1,
        icon: 'laptop',
        name: 'Dashboard',
        router: '/dashboard',
      },
    ],
    menuPopoverVisible: false,
    siderFold: window.localStorage.getItem(`${prefix}siderFold`) === 'true',
    darkTheme: window.localStorage.getItem(`${prefix}darkTheme`) === 'true',
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(window.localStorage.getItem(`${prefix}navOpenKeys`)) || [],
    locationPathname: '',
    locationQuery: {},
    tabPanes: [],
    currentTabKey: 1,
  },
  subscriptions: {

    setupHistory ({ dispatch, history }) {
      history.listen((location) => {
        dispatch({
          type: 'updateState',
          payload: {
            locationPathname: location.pathname,
            locationQuery: queryString.parse(location.search),
          },
        })
      })
    },

    setup ({ dispatch }) {
      dispatch({ type: 'query' })
      let tid
      window.onresize = () => {
        clearTimeout(tid)
        tid = setTimeout(() => {
          dispatch({ type: 'changeNavbar' })
        }, 300)
      }
    },

  },
  effects: {

    * query ({
      payload,
    }, { call, put, select }) {
      const { success, user } = yield call(query, payload)
      const { locationPathname } = yield select(_ => _.app)
      if (success && user) {
        const { list } = yield call(menusService.query)
        const { permissions } = user
        let menu = list
        if (permissions.role === EnumRoleType.ADMIN || permissions.role === EnumRoleType.DEVELOPER) {
          permissions.visit = list.map(item => item.id)
        } else {
          menu = list.filter((item) => {
            const cases = [
              permissions.visit.includes(item.id),
              item.mpid ? permissions.visit.includes(item.mpid) || item.mpid === '-1' : true,
              item.bpid ? permissions.visit.includes(item.bpid) : true,
            ]
            return cases.every(_ => _)
          })
        }
        yield put({
          type: 'updateState',
          payload: {
            user,
            permissions,
            menu,
          },
        })
        if (location.pathname === '/login') {
          yield put(routerRedux.push({
            pathname: '/dashboard',
          }))
        }
      } else if (config.openPages && config.openPages.indexOf(locationPathname) < 0) {
        yield put(routerRedux.push({
          pathname: '/login',
          search: queryString.stringify({
            from: locationPathname,
          }),
        }))
      }
    },

    * logout ({
      payload,
    }, { call, put }) {
      const data = yield call(logout, parse(payload))
      if (data.success) {
        yield put({ type: 'query' })
      } else {
        throw (data)
      }
    },

    * changeNavbar (action, { put, select }) {
      const { app } = yield (select(_ => _))
      const isNavbar = document.body.clientWidth < 769
      if (isNavbar !== app.isNavbar) {
        yield put({ type: 'handleNavbar', payload: isNavbar })
      }
    },

    * flushTabs ({
      payload,
    }, { put, select }) {
      const { key, children } = payload
      const { tabPanes } = yield select(_ => _.app)
      let exist = false
      for (const pane of tabPanes) {
        if (pane.key === key) {
          exist = true
          break
        }
      }
      // 如果key不存在就要新增一个tabPane
      if (!exist) {
        tabPanes.push({
          key,
          content: React.cloneElement(children),  // 我本来是想clone一下children的, 这样比较保险, 不同tab不会互相干扰, 但发现似乎不clone也没啥bug
          // content: children,
        })
      }
      yield put({
        type: 'updateState',
        payload: {
          tabPanes,
          currentTabKey: key,
        },
      })
    },
    * removeTab ({
      payload,
    }, { put, select }) {
      const { targetKey } = payload
      const { currentTabKey } = yield select(_ => _.app)
      const { tabPanes } = yield select(_ => _.app)
      // 如果关闭的是当前tab, 要激活哪个tab?
      // 首先尝试激活左边的, 再尝试激活右边的
      let nextTabKey = currentTabKey
      if (currentTabKey === targetKey) {
        let currentTabIndex = -1
        tabPanes.forEach((pane, i) => {
          if (pane.key === targetKey) {
            currentTabIndex = i
          }
        })
        // 如果当前tab左边还有tab, 就激活左边的
        if (currentTabIndex > 0) {
          nextTabKey = tabPanes[currentTabIndex - 1].key
        }
        // 否则就激活右边的tab
        else if (currentTabIndex === 0 && tabPanes.length > 1) {
          nextTabKey = tabPanes[currentTabIndex + 1].key
        }
        // 其实还有一种情况, 就是只剩最后一个tab, 但这里不用处理
      }
      const newTabPanes = tabPanes.filter(pane => pane.key !== targetKey)
      yield put({
        type: 'updateState',
        payload: { tabPanes: newTabPanes, currentTabKey: nextTabKey },
      })
    },
  },
  reducers: {
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },

    switchSider (state) {
      window.localStorage.setItem(`${prefix}siderFold`, !state.siderFold)
      return {
        ...state,
        siderFold: !state.siderFold,
      }
    },

    switchTheme (state) {
      window.localStorage.setItem(`${prefix}darkTheme`, !state.darkTheme)
      return {
        ...state,
        darkTheme: !state.darkTheme,
      }
    },

    switchMenuPopver (state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      }
    },

    handleNavbar (state, { payload }) {
      return {
        ...state,
        isNavbar: payload,
      }
    },

    handleNavOpenKeys (state, { payload: navOpenKeys }) {
      return {
        ...state,
        ...navOpenKeys,
      }
    },
  },
}
