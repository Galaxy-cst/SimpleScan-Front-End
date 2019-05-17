import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Form, Input, Select, Button, Card, Radio } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class BasicForms extends PureComponent {
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'form/submitRegularForm',
          payload: values,
        });
      }
    });
  };

  render() {
    const { submitting } = this.props;
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <PageHeaderWrapper
        title={<FormattedMessage id="menu.form.basicform" />}
        content="向Payload库中添加新的检测脚本，添加请重新运行之前的扫描以获得最新结果"
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="Payload名称">
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: '请输入Payload名称',
                  },
                ],
              })(<Input placeholder="Payload名称" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="JSON描述代码">
              {getFieldDecorator('goal', {
                rules: [
                  {
                    required: true,
                    message: '请输入JSON描述代码',
                  },
                ],
              })(<TextArea style={{ minHeight: 32 }} placeholder="{}" rows={4} />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="Payload类型"
              help="通用漏洞会对所有服务进行探测；CVE只会探测对应服务版本；"
            >
              <div>
                {getFieldDecorator('public', {
                  initialValue: 'general',
                })(
                  <Radio.Group>
                    <Radio value="general">通用漏洞</Radio>
                    <Radio value="cve">CVE</Radio>
                  </Radio.Group>
                )}
                <FormItem style={{ marginBottom: 0 }}>
                  {getFieldDecorator('publicUsers')(
                    <Select
                      mode="multiple"
                      placeholder={formatMessage({ id: 'form.publicUsers.placeholder' })}
                      style={{
                        margin: '8px 0',
                        display: getFieldValue('public') === '2' ? 'block' : 'none',
                      }}
                    >
                      <Option value="1">
                        <FormattedMessage id="form.publicUsers.option.A" />
                      </Option>
                      <Option value="2">
                        <FormattedMessage id="form.publicUsers.option.B" />
                      </Option>
                      <Option value="3">
                        <FormattedMessage id="form.publicUsers.option.C" />
                      </Option>
                    </Select>
                  )}
                </FormItem>
              </div>
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                <FormattedMessage id="form.submit" />
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default BasicForms;
