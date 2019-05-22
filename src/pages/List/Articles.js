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

@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
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
      type: 'list/fetch',
      payload: {
        count: 5,
      },
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
    const { form, loading } = this.props;
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

    const list = [];
    for (let i = 0; i < 20; i += 1) {
      list.push({
        id: `fake-list-${i}`,
        title: 'PHP常见信息泄露文件',
        cover: 'cover',
        status: ['active', 'exception', 'normal'][i % 3],
        percent: Math.ceil(Math.random() * 50) + 50,
        updatedAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i),
        createdAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i),
        subDescription: 'subDescription',
        description:
          '在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。',
        activeUser: Math.ceil(Math.random() * 100000) + 100000,
        newUser: Math.ceil(Math.random() * 1000) + 1000,
        star: Math.ceil(Math.random() * 100) + 100,
        like: Math.ceil(Math.random() * 100) + 100,
        message: Math.ceil(Math.random() * 10) + 10,
        content:
          '段落示意：蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。',
        author: 'SimpleScan',
      });
    }

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
      list.length > 0 ? (
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
      const itemlist = [1, 2, 3, 4, 5];
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
              loading={list.length === 0 ? loading : false}
              rowKey="id"
              itemLayout="vertical"
              loadMore={loadMore}
              dataSource={list}
              renderItem={item => (
                <List.Item
                  key={item.id}
                  actions={[
                    <IconText type="file-text" text="查看" />,
                    <IconText type="form" text="编辑" />,
                    <IconText type="delete" text="删除" />,
                  ]}
                  extra={<div className={styles.listItemExtra} />}
                >
                  <List.Item.Meta
                    title={
                      <a className={styles.listItemMetaTitle} href={item.href}>
                        {item.title}
                      </a>
                    }
                    description={
                      <span>
                        <Tag>常见漏洞</Tag>
                        <Tag>GET</Tag>
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
