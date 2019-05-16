import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import { Row, Col, Icon, Menu, Dropdown } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { getTimeDistance } from '@/utils/utils';
import styles from './Analysis.less';
import PageLoading from '@/components/PageLoading';

const IntroduceRow = React.lazy(() => import('./IntroduceRow'));
const ProportionService = React.lazy(() => import('./ProportionService'));
const ProportionVulnerability = React.lazy(() => import('./ProportionVulnerability'));

@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/fetch'],
}))
class Analysis extends Component {
  state = {
    loading: true,
    salesType: 'all',
    rangePickerValue: getTimeDistance('year'),
  };

  componentDidMount() {
    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'chart/fetch',
      });
    });
    setTimeout(() => {
      this.setState({
        loading: false,
      });
    }, 2000);
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
    cancelAnimationFrame(this.reqRef);
  }

  handleChangeSalesType = e => {
    this.setState({
      salesType: e.target.value,
    });
  };

  handleRangePickerChange = rangePickerValue => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue,
    });

    dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  selectDate = type => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });

    dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  isActive = type => {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
    return '';
  };

  render() {
    const { salesType, loading: stateLoading } = this.state;
    const { chart, loading: propsLoading } = this.props;
    const loading = stateLoading || propsLoading;
    const { visitData } = chart;
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
    const menu = (
      <Menu>
        <Menu.Item>操作一</Menu.Item>
        <Menu.Item>操作二</Menu.Item>
      </Menu>
    );

    const dropdownGroup = (
      <span className={styles.iconGroup}>
        <Dropdown overlay={menu} placement="bottomRight">
          <Icon type="ellipsis" />
        </Dropdown>
      </span>
    );

    return (
      <GridContent>
        <Suspense fallback={<PageLoading />}>
          <IntroduceRow loading={loading} visitData={visitData} />
        </Suspense>
        <div className={styles.twoColLayout}>
          <Row gutter={24} type="flex">
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <ProportionService
                  dropdownGroup={dropdownGroup}
                  salesType={salesType}
                  loading={loading}
                  servicePieData={servicePieData}
                  handleChangeSalesType={this.handleChangeSalesType}
                />
              </Suspense>
            </Col>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <ProportionVulnerability
                  dropdownGroup={dropdownGroup}
                  salesType={salesType}
                  loading={loading}
                  vulnerabilityPieData={vulnerabilityPieData}
                  handleChangeSalesType={this.handleChangeSalesType}
                />
              </Suspense>
            </Col>
          </Row>
        </div>
      </GridContent>
    );
  }
}

export default Analysis;
