import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Form, Input, Button, Popover, Progress } from 'antd';
import { connect } from 'dva';
import styles from './BaseView.less';
// import { getTimeDistance } from '@/utils/utils';

const FormItem = Form.Item;

const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      <FormattedMessage id="validation.password.strength.strong" />
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      <FormattedMessage id="validation.password.strength.medium" />
    </div>
  ),
  poor: (
    <div className={styles.error}>
      <FormattedMessage id="validation.password.strength.short" />
    </div>
  ),
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
@Form.create()
class BaseView extends Component {
  state = {
    confirmDirty: false,
    visible: false,
  };

  componentDidMount() {
    this.setBaseInfo();
  }

  setBaseInfo = () => {
    const { currentUser, form } = this.props;
    Object.keys(form.getFieldsValue()).forEach(key => {
      const obj = {};
      obj[key] = currentUser[key] || null;
      form.setFieldsValue(obj);
    });
  };

  getViewDom = ref => {
    this.view = ref;
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback(formatMessage({ id: 'validation.password.twice' }));
    } else {
      callback();
    }
  };

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const containchat = e => !/^[0-9a-zA-Z]*$/.test(e);
    if (value && value.length > 9 && containchat(value)) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  checkPassword = (rule, value, callback) => {
    const { visible, confirmDirty } = this.state;
    if (!value) {
      this.setState({
        visible: !!value,
      });
      callback(formatMessage({ id: 'validation.password.required' }));
    } else {
      if (!visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6) {
        callback(formatMessage({ id: 'validation.password.strength.msg' }));
      } else {
        const { form } = this.props;
        if (value && confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      }
    }
  };

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={
            (value.length * 10 > 80 ? 80 : value.length * 10) + (passwordStatus === 'ok' ? 20 : 0)
          }
          showInfo={false}
        />
      </div>
    ) : null;
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { visible } = this.state;

    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" onSubmit={this.handleSubmit} hideRequiredMark>
            <FormItem label="原口令">
              {getFieldDecorator('original-password', {
                rules: [
                  {
                    required: true,
                    message: '请输入原口令',
                  },
                ],
              })(
                <Input
                  type="password"
                  placeholder={formatMessage({ id: 'form.password.placeholder' })}
                />
              )}
            </FormItem>
            <FormItem label="新口令">
              <Popover
                getPopupContainer={node => node.parentNode}
                content={
                  <div style={{ padding: '4px 0' }}>
                    {passwordStatusMap[this.getPasswordStatus()]}
                    {this.renderPasswordProgress()}
                    <div style={{ marginTop: 10 }}>
                      <FormattedMessage id="validation.password.strength.msg" />
                    </div>
                  </div>
                }
                overlayStyle={{ width: 240 }}
                placement="right"
                visible={visible}
              >
                {getFieldDecorator('password', {
                  rules: [
                    {
                      validator: this.checkPassword,
                    },
                  ],
                })(
                  <Input
                    type="password"
                    placeholder={formatMessage({ id: 'form.password.placeholder' })}
                  />
                )}
              </Popover>
            </FormItem>
            <FormItem label="再次输入">
              {getFieldDecorator('confirm', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.confirm-password.required' }),
                  },
                  {
                    validator: this.checkConfirm,
                  },
                ],
              })(
                <Input
                  type="password"
                  placeholder={formatMessage({ id: 'form.confirm-password.placeholder' })}
                />
              )}
            </FormItem>
            <Button type="primary">
              <FormattedMessage
                id="app.settings.basic.update"
                defaultMessage="Update Information"
              />
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}

export default BaseView;
