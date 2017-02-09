import { parse } from 'qs'

export default {
  namespace: 'test',
  state: {
    name:"11111111111111111"
  },
  reducers: {
    // testReducers (state, {payload}) {
    //   return { ...state,...payload}
    // }
    testReducers (state, {payload:{name}}) {
      return { ...state,name}
    }
  },
  effects: {
    *testEffects ({ payload }, { call, put }) {
      yield put({
        type: 'testReducers',
        payload: {
          name:"2222222222222"
        }
      })
    }
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      dispatch({
        type: 'testReducers',
        payload: {
          name:"setup-->1111111111111"
        }
      })
    }
  },
};
