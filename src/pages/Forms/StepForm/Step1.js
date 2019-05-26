import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, Divider } from 'antd';
import styles from './style.less';

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@connect(({ form }) => ({
  data: form.step,
}))
@Form.create()
class Step1 extends React.PureComponent {
  render() {
    const { form, dispatch } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'form/checkStepForm',
            payload: values,
          });
        }
      });
    };
    return (
      <Fragment>
        <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
          <Form.Item {...formItemLayout} label="扫描目标">
            <Input.Group compact>
              {getFieldDecorator('type', {
                initialValue: 'ip',
              })(
                <Select defaultValue="ip" style={{ width: 80 }}>
                  <Option value="ip">IP</Option>
                  <Option value="domain">域名</Option>
                </Select>
              )}
              {getFieldDecorator('ip', {
                rules: [{ required: true, message: '请输入扫描目标' }],
              })(<Input style={{ width: 'calc(100% - 100px)' }} placeholder="127.0.0.1" />)}
            </Input.Group>
          </Form.Item>
          <Form.Item {...formItemLayout} label="扫描端口范围">
            {getFieldDecorator('ports', {
              initialValue: 'all',
              rules: [{ required: true, message: '请输入扫描端口范围' }],
            })(<Input placeholder="22,80-3000,8000-8200" />)}
          </Form.Item>
          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: {
                span: formItemLayout.wrapperCol.span,
                offset: formItemLayout.labelCol.span,
              },
            }}
            label=""
          >
            <Button type="primary" onClick={onValidateForm}>
              下一步
            </Button>
          </Form.Item>
        </Form>
        <Divider style={{ margin: '40px 0 24px' }} />
        <div className={styles.desc}>
          <h3>说明</h3>
          <h4>扫描目标</h4>
          <p>扫描目标可以是IP、IP段或者域名</p>
          <p>IP段可以使用127.0.0.1-127.0.1.1格式，也可以使用127.0.0.1/24格式。</p>
          <p>域名会解析为IP，该域名下的所有IP地址都会被扫描。</p>
          <h4>扫描端口</h4>
          <p>端口使用逗号分隔，可以使用-连接符表示端口范围。输入“all”表示扫描所有端口。</p>
          <p>示例：&quot;80,81-82&quot;表示80,81,82三个端口</p>
        </div>
      </Fragment>
    );
  }
}

export default Step1;
