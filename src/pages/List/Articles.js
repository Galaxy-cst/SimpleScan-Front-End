import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Card, Select, List, Tag, Icon, Row, Col, Button, Input } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';

import TagSelect from '@/components/TagSelect';
import StandardFormRow from '@/components/StandardFormRow';
import ArticleListContent from '@/components/ArticleListContent';
import styles from './Articles.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const { Option } = Select;
const FormItem = Form.Item;

const pageSize = 5;

@connect(({ rule, loading }) => ({
  payloads: rule.payloads,
  loading: loading.effects['profile/fetchTaskDetail'],
}))
@Form.create({
  onValuesChange({ dispatch }, changedValues, allValues) {
    // 表单项变化时请求数据
    // eslint-disable-next-line
    console.log(changedValues, allValues);
    // 模拟查询表单生效
    dispatch({
      type: 'list/fetch',
      payload: {
        count: 5,
      },
    });
  },
})
class SearchList extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetchPayloads',
    });
  }

  setOwner = () => {
    const { form } = this.props;
    form.setFieldsValue({
      owner: ['wzj'],
    });
  };

  fetchMore = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'list/appendFetch',
      payload: {
        count: pageSize,
      },
    });
  };

  render() {
    const { form, loading, payloads } = this.props;
    const { getFieldDecorator } = form;

    const mainSearch = (
      <div style={{ textAlign: 'center' }}>
        <Input.Search
          placeholder="请输入"
          enterButton="搜索"
          size="large"
          onSearch={this.handleFormSubmit}
          style={{ maxWidth: 522, width: '100%' }}
        />
      </div>
    );

    const IconText = ({ type, text }) => (
      <span>
        <Icon type={type} style={{ marginRight: 8 }} />
        {text}
      </span>
    );

    const formItemLayout = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 12 },
      },
    };

    const actionsTextMap = {
      expandText: <FormattedMessage id="component.tagSelect.expand" defaultMessage="Expand" />,
      collapseText: (
        <FormattedMessage id="component.tagSelect.collapse" defaultMessage="Collapse" />
      ),
      selectAllText: <FormattedMessage id="component.tagSelect.all" defaultMessage="All" />,
    };

    const loadMore =
      payloads.length > 0 ? (
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Button onClick={this.fetchMore} style={{ paddingLeft: 48, paddingRight: 48 }}>
            {loading ? (
              <span>
                <Icon type="loading" /> 加载中...
              </span>
            ) : (
              '加载更多'
            )}
          </Button>
        </div>
      ) : null;

    const options = (() => {
      const allTypes = payloads.map(e => e.type);
      const itemlist = [...new Set(allTypes)];
      const optionslist = itemlist.map(index => (
        <TagSelect.Option value={`cat${index}`}>{index}</TagSelect.Option>
      ));
      return optionslist;
    })();

    return (
      <PageHeaderWrapper title="Payloads" content={mainSearch}>
        <Fragment>
          <Card bordered={false}>
            <Form layout="inline">
              <StandardFormRow title="所属类目" block style={{ paddingBottom: 11 }}>
                <FormItem>
                  {getFieldDecorator('category')(
                    <TagSelect expandable actionsText={actionsTextMap}>
                      {options}
                    </TagSelect>
                  )}
                </FormItem>
              </StandardFormRow>
              <StandardFormRow title="其它选项" grid last>
                <Row gutter={16}>
                  <Col xl={8} lg={10} md={12} sm={24} xs={24}>
                    <FormItem {...formItemLayout} label="危险性">
                      {getFieldDecorator('user', {})(
                        <Select placeholder="不限" style={{ maxWidth: 200, width: '100%' }}>
                          <Option value="danger">高危</Option>
                          <Option value="warning">中危</Option>
                          <Option value="normal">低危</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </StandardFormRow>
            </Form>
          </Card>
          <Card
            style={{ marginTop: 24 }}
            bordered={false}
            bodyStyle={{ padding: '8px 32px 32px 32px' }}
          >
            <List
              size="large"
              loading={payloads.length === 0 ? loading : false}
              rowKey="id"
              itemLayout="vertical"
              loadMore={loadMore}
              dataSource={payloads}
              renderItem={item => (
                <List.Item
                  key={item.name}
                  actions={[
                    <IconText type="file-text" text="查看" />,
                    <IconText type="form" text="编辑" />,
                    <IconText type="delete" text="删除" />,
                  ]}
                  extra={<div className={styles.listItemExtra} />}
                >
                  <List.Item.Meta
                    title={<a className={styles.listItemMetaTitle}>{item.name}</a>}
                    description={
                      <span>
                        <Tag>{item.type}</Tag>
                        <Tag>{item.method}</Tag>
                      </span>
                    }
                  />
                  <ArticleListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </Fragment>
      </PageHeaderWrapper>
    );
  }
}

export default SearchList;
