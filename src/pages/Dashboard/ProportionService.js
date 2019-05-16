import React, { memo } from 'react';
import { Card, Button } from 'antd';
import numeral from 'numeral';
import styles from './Analysis.less';
import { Pie } from '@/components/Charts';

const ProportionService = memo(({ loading, servicePieData }) => (
  <Card
    loading={loading}
    className={styles.salesCard}
    bordered={false}
    title="服务类别占比"
    bodyStyle={{ padding: 24 }}
    extra={<Button shape="circle" icon="search" />}
    style={{ marginTop: 24 }}
  >
    <h4 style={{ marginTop: 10, marginBottom: 32 }}>服务类别与总服务数</h4>
    <Pie
      hasLegend
      subTitle="总服务数"
      total={numeral(2300).format('0,0')}
      data={servicePieData}
      valueFormat={value => <span>{numeral(value).format('0,0')}</span>}
      height={270}
      lineWidth={4}
      style={{ padding: '8px 0' }}
    />
  </Card>
));

export default ProportionService;
