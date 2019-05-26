import { queryBasicProfile, queryAdvancedProfile, getTaskDetail } from '@/services/api';

export default {
  namespace: 'profile',

  state: {
    taskDetail: { vuln: [] },
    taskDetailServices: [],
    taskDetailVulnerabilities: [],
    basicGoods: [],
    advancedOperation1: [],
    advancedOperation2: [],
    advancedOperation3: [],
  },

  effects: {
    *fetchBasic({ payload }, { call, put }) {
      const response = yield call(queryBasicProfile, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },
    *fetchAdvanced(_, { call, put }) {
      const response = yield call(queryAdvancedProfile);
      yield put({
        type: 'show',
        payload: response,
      });
    },
    *fetchTaskDetail({ payload }, { call, put }) {
      const response = yield call(getTaskDetail, payload);
      yield put({
        type: 'taskDetail',
        payload: response,
      });
    },
  },

  reducers: {
    show(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    taskDetail(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
