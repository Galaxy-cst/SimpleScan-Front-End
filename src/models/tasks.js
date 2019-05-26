import { getTaskList } from '@/services/api';

export default {
  namespace: 'tasks',

  state: {
    data: {
      list: [],
    },
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(getTaskList);
      yield put({
        type: 'saveTasksList',
        payload: response,
      });
    },
  },

  reducers: {
    saveTasksList(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
