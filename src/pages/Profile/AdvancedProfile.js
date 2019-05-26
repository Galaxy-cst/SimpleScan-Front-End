import React, { Component, Fragment } from 'react';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import { connect } from 'dva';
import { Button, Icon, Row, Col, Steps, Card, Table, Empty } from 'antd';
import { Gauge, Pie } from '@/components/Charts';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import numeral from 'numeral';
import ReactJson from 'react-json-view';
import styles from './AdvancedProfile.less';

const { Step } = Steps;
const { Description } = DescriptionList;
const ButtonGroup = Button.Group;

const getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth;

const formatPieData = (data, type) => {
  const list = {};
  const result = [];
  if (data.length === 0) {
    return [];
  }
  data.forEach(e => {
    if (list[e[type]]) {
      list[e[type]] += 1;
    } else {
      list[e[type]] = 1;
    }
  });
  Object.keys(list).forEach(key => {
    result.push({ x: key, y: list[key] });
  });
  return result;
};

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

function ServiceTable(data) {
  const expandedRowRender = record => {
    const expandedRow = <ReactJson src={record.detail} />;
    return expandedRow;
  };

  const columns = [
    { title: '端口', dataIndex: 'port', key: 'port' },
    { title: '服务', dataIndex: 'service', key: 'service' },
    { title: '漏洞数', dataIndex: 'vulncount', key: 'vulnerability' },
    { title: '高危漏洞', dataIndex: 'highvulncount', key: 'state' },
    { title: '扫描时间', dataIndex: 'updated_time', key: 'date' },
  ];

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

function VulnerabilityTable(data) {
  const expandedRowRender = record => {
    const panel = (
      // <Collapse defaultActiveKey={[]}>
      //   <Collapse.Panel header="/www/.git" key="1">
      //     <div className={styles.twoColLayout} style={{ marginBottom: 24 }}>
      //       <Row gutter={24} type="flex">
      //         <Col xl={12} lg={24} md={24} sm={24} xs={24}>
      //           <Card title="请求内容" bordered={false}>
      //             123
      //           </Card>
      //         </Col>
      //         <Col xl={12} lg={24} md={24} sm={24} xs={24}>
      //           <Card title="请求结果" bordered={false}>
      //             123
      //           </Card>
      //         </Col>
      //       </Row>
      //     </div>
      //   </Collapse.Panel>
      // </Collapse>
      <ReactJson src={record.detail} />
    );
    return panel;
  };

  const columns = [
    { title: '漏洞名称', dataIndex: 'name', key: 'name' },
    { title: '漏洞类型', dataIndex: 'type', key: 'type' },
    { title: '危险性', dataIndex: 'status', key: 'state' },
    { title: '端口', dataIndex: 'port', key: 'port' },
    { title: '扫描时间', dataIndex: 'updated_time', key: 'date' },
  ];

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
  loading: loading.effects['profile/fetchTaskDetail'],
}))
class AdvancedProfile extends Component {
  state = {
    stepDirection: 'horizontal',
    tableListKey: 'service',
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    const { params } = match;
    dispatch({
      type: 'profile/fetchTaskDetail',
      payload: params.id,
    });
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
    const { profile = {}, loading } = this.props;
    const { taskDetail, taskDetailServices, taskDetailVulnerabilities } = profile;
    const { tableListKey } = this.state;
    const percent =
      100 - taskDetail.vuln.high * 20 - taskDetail.vuln.middle * 10 - taskDetail.vuln.low * 1;
    const vulncount = taskDetail.vuln.high + taskDetail.vuln.middle + taskDetail.vuln.low;

    const description = (
      <DescriptionList className={styles.headerList} size="small" col="2">
        <Description term="IP">{taskDetail.ip}</Description>
        <Description term="开放端口数量">{taskDetail.portscount || 0}个</Description>
        <Description term="创建时间">{taskDetail.created_time}</Description>
        <Description term="最新扫描时间">{taskDetail.updated_time}</Description>
      </DescriptionList>
    );

    const extra = (
      <Row>
        <Col xs={24} sm={12}>
          <div className={styles.textSecondary}>状态</div>
          <div className={styles.heading}>端口扫描中</div>
        </Col>
        <Col xs={24} sm={12}>
          <div className={styles.textSecondary}>发现漏洞数</div>
          <div className={styles.heading}>{vulncount || 0}</div>
        </Col>
      </Row>
    );

    const dashboard = (() => {
      const tDashboard = (
        <div>
          <Col className="gutter-row" md={6} sm={24}>
            <Gauge
              title="健康度"
              style={{ zIndex: 1 }}
              height={164}
              percent={(() => {
                if (percent < 0) {
                  return 0;
                }
                return percent;
              })()}
              color={(() => {
                switch (true) {
                  case percent > 90:
                    return '#2fc25b';
                  case percent > 60:
                    return '#1890ff';
                  case percent > 40:
                    return '#fad337';
                  default:
                    return '#d42e3c';
                }
              })()}
            />
          </Col>
          <Col className="gutter-row" md={18} sm={24} xs={0}>
            <div className={styles.extraContent}>
              <div className={`${styles.statItem} ${styles.danger}`}>
                <p>高危漏洞</p>
                <p>{taskDetail.vuln.high}</p>
              </div>
              <div className={`${styles.statItem} ${styles.primary}`}>
                <p>中危漏洞</p>
                <p>{taskDetail.vuln.middle}</p>
              </div>
              <div className={`${styles.statItem} ${styles.green}`}>
                <p>低危漏洞</p>
                <p>{taskDetail.vuln.low}</p>
              </div>
            </div>
          </Col>
        </div>
      );
      if (vulncount) {
        return tDashboard;
      }
      return <Empty />;
    })();

    const tableListcontent = {
      service: ServiceTable(taskDetailServices),
      vulnerability: VulnerabilityTable(taskDetailVulnerabilities),
    };

    const servicePieData = formatPieData(taskDetailServices, 'service');

    const vulnerabilityPieData = formatPieData(taskDetailVulnerabilities, 'type');

    const ServicePieWapper = props => {
      const { isEmpty } = props;
      if (isEmpty) {
        return <Empty />;
      }
      return (
        <Pie
          hasLegend
          title="服务类别占比"
          subTitle="总服务数"
          total={() =>
            servicePieData.reduce((a, b) => {
              return { y: a.y + b.y };
            }).y
          }
          loading={loading}
          data={servicePieData}
          valueFormat={value => <span>{numeral(value).format('0,0')}</span>}
          height={294}
        />
      );
    };

    const VulnerabilityPieWapper = props => {
      const { isEmpty } = props;
      if (isEmpty) {
        return <Empty />;
      }
      return (
        <Pie
          hasLegend
          title="漏洞类别占比"
          subTitle="总漏洞数"
          total={() =>
            vulnerabilityPieData.reduce((a, b) => {
              return { y: a.y + b.y };
            }).y
          }
          loading={loading}
          data={vulnerabilityPieData}
          valueFormat={value => <span>{numeral(value).format('0,0')}</span>}
          height={294}
        />
      );
    };

    return (
      <PageHeaderWrapper
        title={`SST-${taskDetail.taskid}`}
        extra={action}
        content={description}
        extraContent={extra}
        loading={loading}
      >
        <Card title="扫描进度" style={{ marginBottom: 24 }} bordered={false}>
          <Steps current={1}>
            <Step title="创建任务" description={desc1} />
            <Step title="端口扫描" description={desc2} icon={<Icon type="loading" />} />
            <Step title="脆弱性测试" />
            <Step title="弱口令检测" />
            <Step title="完成" />
          </Steps>
        </Card>
        <Card style={{ marginBottom: 24 }} bordered={false}>
          <Row gutter={16}>{dashboard}</Row>
        </Card>
        <div className={styles.twoColLayout} style={{ marginBottom: 24 }}>
          <Row gutter={24} type="flex">
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Card title="服务类别占比" bordered={false}>
                <ServicePieWapper isEmpty={servicePieData.length === 0} />
              </Card>
            </Col>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Card title="漏洞类别占比" bordered={false}>
                <VulnerabilityPieWapper isEmpty={vulnerabilityPieData.length === 0} />
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
