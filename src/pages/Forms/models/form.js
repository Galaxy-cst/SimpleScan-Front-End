import { routerRedux } from 'dva/router';
import { notification } from 'antd';
import { submitTask, taskPreCheck } from '@/services/api';

export default {
  namespace: 'form',

  state: {
    step: {
      ip: '',
      ports: '',
      type: '',
    },
  },

  effects: {
    *submitStepForm({ payload }, { call, put }) {
      const response = yield call(submitTask, payload);
      if (response.status === 'ok') {
        yield put(routerRedux.push('/form/step-form/result'));
      } else {
        notification.error({
          message: '错误！',
          description: response.description,
        });
      }
    },
    *checkStepForm({ payload }, { call, put }) {
      const response = yield call(taskPreCheck, payload);
      if (response.status === 'ok') {
        yield put({
          type: 'saveStepFormData',
          payload,
        });
        yield put(routerRedux.push('/form/step-form/confirm'));
      } else {
        notification.error({
          message: '输入错误！',
          description: response.description,
        });
      }
    },
  },

  reducers: {
    saveStepFormData(state, { payload }) {
      return {
        ...state,
        step: {
          ...state.step,
          ...payload,
        },
      };
    },
  },
};
