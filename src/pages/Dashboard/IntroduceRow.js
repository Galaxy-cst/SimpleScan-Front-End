import React, { memo } from 'react';
import { Row, Col, Icon, Tooltip } from 'antd';
// import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import numeral from 'numeral';
import styles from './Analysis.less';
import { ChartCard, MiniArea, MiniProgress, Field } from '@/components/Charts';
import Trend from '@/components/Trend';
// import Yuan from '@/utils/Yuan';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 },
};

const IntroduceRow = memo(({ loading, visitData }) => (
  <Row gutter={24}>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title="不安全的主机"
        action={
          <Tooltip title="存在安全漏洞的主机数量">
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        loading={loading}
        total={() => 10}
        footer={<Field label="历史最大值:" value={`${numeral(20).format('0,0')}`} />}
        contentHeight={46}
      >
        <Trend flag="up" style={{ marginRight: 16 }}>
          周同比
          <span className={styles.trendText}>12%</span>
        </Trend>
        <Trend flag="down">
          日同比
          <span className={styles.trendText}>11%</span>
        </Trend>
      </ChartCard>
    </Col>

    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title="漏洞个数趋势"
        action={
          <Tooltip title="SimpleScan发现的所有漏洞数量">
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        total={numeral(201).format('0,0')}
        footer={<Field label="历史最大值:" value={numeral(300).format('0,0')} />}
        contentHeight={46}
      >
        <MiniArea color="#975FE4" data={visitData} />
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title="监控主机数"
        total={numeral(320).format('0,0')}
        footer={<Field label="检测的服务数:" value="127.0.0.1" />}
        contentHeight={46}
      >
        <MiniArea color="#975FE4" data={visitData} />
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        loading={loading}
        bordered={false}
        title="任务队列"
        action={
          <Tooltip title="后台任务完成情况">
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        total="78%"
        footer={<Field label="正在进行的任务:" value="127.0.0.1" />}
        contentHeight={46}
      >
        <MiniProgress percent={78} strokeWidth={8} color="#13C2C2" />
      </ChartCard>
    </Col>
  </Row>
));

export default IntroduceRow;
