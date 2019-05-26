import { removeRule, addRule, updateRule, getTaskList, getPayloadsList } from '@/services/api';

export default {
  namespace: 'rule',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    payloads: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getTaskList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *fetchPayloads(_, { call, put }) {
      const response = yield call(getPayloadsList);
      yield put({
        type: 'savePayloads',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    savePayloads(state, action) {
      return {
        ...state,
        payloads: action.payload,
      };
    },
  },
};
