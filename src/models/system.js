import { getSystemInfo } from '@/services/api';

export default {
  namespace: 'system',
  state: {
    system_info: {
      cpu: 0,
      mem: 0,
      pps: {},
      ip: {},
    },
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(getSystemInfo);
      yield put({
        type: 'changeSystemInfo',
        payload: response,
      });
    },
  },
  reducers: {
    changeSystemInfo(state, action) {
      return {
        ...state,
        system_info: action.payload,
      };
    },
  },
};
