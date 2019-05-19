import React, { Component, Fragment } from 'react';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import { connect } from 'dva';
import { Button, Icon, Row, Col, Steps, Card, Badge, Table, Collapse } from 'antd';
import { Gauge, Pie } from '@/components/Charts';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import numeral from 'numeral';
import styles from './AdvancedProfile.less';

const { Step } = Steps;
const { Description } = DescriptionList;
const ButtonGroup = Button.Group;
const { Panel } = Collapse.Panel;

const getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth;

const action = (
  <Fragment>
    <ButtonGroup>
      <Button>开始</Button>
      <Button>停止</Button>
      <Button>再次扫描</Button>
      <Button type="danger">删除</Button>
    </ButtonGroup>
    <Button type="primary">导出报告</Button>
  </Fragment>
);

const extra = (
  <Row>
    <Col xs={24} sm={12}>
      <div className={styles.textSecondary}>状态</div>
      <div className={styles.heading}>端口扫描中</div>
    </Col>
    <Col xs={24} sm={12}>
      <div className={styles.textSecondary}>发现漏洞数</div>
      <div className={styles.heading}>2</div>
    </Col>
  </Row>
);

const description = (
  <DescriptionList className={styles.headerList} size="small" col="2">
    <Description term="IP">127.0.0.1</Description>
    <Description term="开放端口数量">20个</Description>
    <Description term="创建时间">2019-05-01 19:20</Description>
    <Description term="最新扫描时间">2019-05-01 20:20</Description>
  </DescriptionList>
);

const desc1 = (
  <div>
    <Fragment>用户添加</Fragment>
    <div>2019-05-01 19:20</div>
  </div>
);

const desc2 = (
  <div>
    <Fragment>任务排队中，当前位于3/30</Fragment>
    <div>
      <a href="">立即开始</a>
    </div>
  </div>
);

const servicePieData = [
  {
    x: 'HTTP',
    y: 2000,
  },
  {
    x: 'SSH',
    y: 100,
  },
  {
    x: 'FTP',
    y: 50,
  },
  {
    x: 'SMB',
    y: 50,
  },
  {
    x: 'MySQL',
    y: 50,
  },
  {
    x: '其他',
    y: 50,
  },
];

const vulnerabilityPieData = [
  {
    x: '信息泄露',
    y: 100,
  },
  {
    x: '弱密码',
    y: 50,
  },
  {
    x: 'SQL注入',
    y: 20,
  },
  {
    x: 'CVE',
    y: 20,
  },
  {
    x: 'XSS',
    y: 10,
  },
  {
    x: '其他',
    y: 1,
  },
];

const tableList = [
  {
    key: 'service',
    tab: '服务详情列表',
  },
  {
    key: 'vulnerability',
    tab: '漏洞详情列表',
  },
];

const tableListcontent = {
  service: <ServiceTable />,
  vulnerability: <VulnerabilityTable />,
};

function ServiceTable() {
  const expandedRowRender = () => {
    const data = [];
    for (let i = 0; i < 3; i += 1) {
      data.push({
        key: i,
        date: '2014-12-24 23:12:00',
        name: 'This is production name',
        upgradeNum: 'Upgraded: 56',
      });
    }
    const expandedRow = (
      <p>
        conf=&quot;10&quot;&nbsp;method=&quot;probed&quot;&nbsp;product=&quot;nginx&quot;&nbsp;version=&quot;1.13.8&quot;
      </p>
    );
    return expandedRow;
  };

  const columns = [
    { title: '端口', dataIndex: 'port', key: 'port' },
    { title: '服务', dataIndex: 'service', key: 'service' },
    { title: 'OS', dataIndex: 'os', key: 'os' },
    { title: '漏洞数', dataIndex: 'vulnerability', key: 'vulnerability' },
    { title: '高危漏洞', dataIndex: 'state', key: 'state' },
    { title: '扫描时间', dataIndex: 'date', key: 'date' },
  ];

  const data = [];
  for (let i = 0; i < 3; i += 1) {
    data.push({
      key: i,
      port: '80',
      service: 'http',
      os: 'Linux 3.2-4.0',
      date: '2018-12-24 23:12:00',
      vulnerability: 2,
      state: (
        <span>
          <Badge status="error" />
          存在
        </span>
      ),
    });
  }

  return (
    <Table
      className="components-table-demo-nested"
      columns={columns}
      expandedRowRender={expandedRowRender}
      dataSource={data}
      pagination={false}
    />
  );
}

function VulnerabilityTable() {
  const expandedRowRender = () => {
    const panel = (
      <Collapse defaultActiveKey={[]}>
        <Panel header="/www/.git" key="1">
          <div className={styles.twoColLayout} style={{ marginBottom: 24 }}>
            <Row gutter={24} type="flex">
              <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                <Card title="请求内容" bordered={false}>
                  123
                </Card>
              </Col>
              <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                <Card title="请求结果" bordered={false}>
                  123
                </Card>
              </Col>
            </Row>
          </div>
        </Panel>
      </Collapse>
    );
    return panel;
  };

  const columns = [
    { title: '漏洞名称', dataIndex: 'name', key: 'name' },
    { title: '漏洞类型', dataIndex: 'type', key: 'type' },
    { title: '危险性', dataIndex: 'state', key: 'state' },
    { title: '数量', dataIndex: 'sum', key: 'sum' },
    { title: '端口', dataIndex: 'port', key: 'port' },
    { title: '服务', dataIndex: 'service', key: 'service' },
    { title: '扫描时间', dataIndex: 'date', key: 'date' },
  ];

  const data = [];
  for (let i = 0; i < 3; i += 1) {
    data.push({
      key: i,
      name: '.git泄露',
      type: '敏感信息泄露',
      state: (
        <span>
          <Badge status="warning" />
          中危
        </span>
      ),
      sum: `${1}个`,
      port: 80,
      service: 'http',
      date: '2018-12-24 23:12:00',
    });
  }

  return (
    <Table
      className="components-table-demo-nested"
      columns={columns}
      expandedRowRender={expandedRowRender}
      dataSource={data}
      pagination={false}
    />
  );
}

@connect(({ profile, loading }) => ({
  profile,
  loading: loading.effects['profile/fetchAdvanced'],
}))
class AdvancedProfile extends Component {
  state = {
    stepDirection: 'horizontal',
    tableListKey: 'service',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'profile/fetchAdvanced',
    });

    this.setStepDirection();
    window.addEventListener('resize', this.setStepDirection, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setStepDirection);
    this.setStepDirection.cancel();
  }

  @Bind()
  @Debounce(200)
  setStepDirection() {
    const { stepDirection } = this.state;
    const w = getWindowWidth();
    if (stepDirection !== 'vertical' && w <= 576) {
      this.setState({
        stepDirection: 'vertical',
      });
    } else if (stepDirection !== 'horizontal' && w > 576) {
      this.setState({
        stepDirection: 'horizontal',
      });
    }
  }

  onTabChange = (key, type) => {
    this.setState({ [type]: key });
  };

  render() {
    const { tableListKey } = this.state;

    return (
      <PageHeaderWrapper title="SST-45" extra={action} content={description} extraContent={extra}>
        <Card title="扫描进度" style={{ marginBottom: 24 }} bordered={false}>
          <Steps current={1}>
            <Step title="创建任务" description={desc1} />
            <Step title="端口扫描" description={desc2} icon={<Icon type="loading" />} />
            <Step title="脆弱性测试" />
            <Step title="弱密码检测" />
            <Step title="完成" />
          </Steps>
        </Card>
        <Card style={{ marginBottom: 24 }} bordered={false}>
          <Row gutter={16}>
            <Col className="gutter-row" md={6} sm={24}>
              <Gauge
                title="健康度"
                style={{ zIndex: 1 }}
                height={164}
                percent={60}
                color="#1890ff"
              />
            </Col>
            <Col className="gutter-row" md={18} sm={24} xs={0}>
              <div className={styles.extraContent}>
                <div className={`${styles.statItem} ${styles.danger}`}>
                  <p>高危漏洞</p>
                  <p>6</p>
                </div>
                <div className={`${styles.statItem} ${styles.primary}`}>
                  <p>中危漏洞</p>
                  <p>8</p>
                </div>
                <div className={`${styles.statItem} ${styles.green}`}>
                  <p>低危漏洞</p>
                  <p>32</p>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
        {/* 扫描初期无数据时前端展示Dome */}
        {/* <Card style={{ marginBottom: 24 }} bordered={false}>
          <div className={styles.noData}>
            <Icon type="frown-o" />
            暂无数据
          </div>
        </Card> */}
        <div className={styles.twoColLayout} style={{ marginBottom: 24 }}>
          <Row gutter={24} type="flex">
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Card title="服务类别占比" bordered={false}>
                <Pie
                  hasLegend
                  title="服务类别占比"
                  subTitle="总服务数"
                  total={() =>
                    servicePieData.reduce((a, b) => {
                      return { y: a.y + b.y };
                    }).y
                  }
                  data={servicePieData}
                  valueFormat={value => <span>{numeral(value).format('0,0')}</span>}
                  height={294}
                />
              </Card>
            </Col>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Card title="漏洞类别占比" bordered={false}>
                <Pie
                  hasLegend
                  title="漏洞类别占比"
                  subTitle="总漏洞数"
                  total={() =>
                    vulnerabilityPieData.reduce((a, b) => {
                      return { y: a.y + b.y };
                    }).y
                  }
                  data={vulnerabilityPieData}
                  valueFormat={value => <span>{numeral(value).format('0,0')}</span>}
                  height={294}
                />
              </Card>
            </Col>
          </Row>
        </div>
        <Card
          style={{ width: '100%', marginBottom: 24 }}
          tabList={tableList}
          activeTabKey={tableListKey}
          onTabChange={key => {
            this.onTabChange(key, 'tableListKey');
          }}
        >
          {tableListcontent[tableListKey]}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default AdvancedProfile;
