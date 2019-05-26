import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, List, Avatar, Button, Icon, Tooltip, Empty } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './Workplace.less';

@connect(({ user, tasks, loading, system }) => ({
  currentUser: user.currentUser,
  systemInfo: system.system_info,
  tasks: tasks.data,
  currentUserLoading: loading.effects['user/fetchCurrent'],
  systemInfoLoading: loading.effects['system/fetch'],
  tasksLoading: loading.effects['tasks/fetch'],
}))
class Workplace extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
    dispatch({
      type: 'system/fetch',
    });
    dispatch({
      type: 'tasks/fetch',
    });
    this.intervalId = setInterval(() => {
      dispatch({
        type: 'system/fetch',
      });
    }, 5000);
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
    clearInterval(this.intervalId);
  }

  previewItem = id => {
    router.push(`/profile/advanced/${id}`);
  };

  renderActivities() {
    const {
      activities: { list },
    } = this.props;
    return list.map(item => {
      const events = item.template.split(/@\{([^{}]*)\}/gi).map(key => {
        if (item[key]) {
          return (
            <a href={item[key].link} key={item[key].name}>
              {item[key].name}
            </a>
          );
        }
        return key;
      });
      return (
        <List.Item key={item.id}>
          <List.Item.Meta
            avatar={<Avatar src={item.user.avatar} />}
            title={
              <span>
                <a className={styles.username}>{item.user.name}</a>
                &nbsp;
                <span className={styles.event}>{events}</span>
              </span>
            }
            description={
              <span className={styles.datetime} title={item.updatedAt}>
                {moment(item.updatedAt).fromNow()}
              </span>
            }
          />
        </List.Item>
      );
    });
  }

  render() {
    const { currentUser, systemInfo, systemInfoLoading, tasks, tasksLoading } = this.props;
    const { list } = tasks;

    const pageHeaderContent =
      currentUser && Object.keys(currentUser).length ? (
        <div className={styles.pageHeaderContent}>
          <div className={styles.content}>
            <div className={styles.contentTitle}>外网IP: {systemInfo.ip.extranet_ip}</div>
            <div>内网IP: {systemInfo.ip.intranet_ip}</div>
          </div>
        </div>
      ) : null;

    const extraContent = (
      <div className={styles.extraContent}>
        <div className={styles.statItem}>
          <p>CPU</p>
          <p>{systemInfo.cpu}%</p>
        </div>
        <div className={styles.statItem}>
          <p>内存</p>
          <p>{systemInfo.mem}%</p>
        </div>
        <div className={styles.statItem}>
          <p>
            pps&nbsp;
            <Tooltip placement="topRight" title="服务器发包速率">
              <Icon type="info-circle-o" />
            </Tooltip>
          </p>
          <p>
            <span>
              <Icon type="up" />
            </span>
            {Math.round(systemInfo.pps.tx_pps)}
            <span>&nbsp;pps</span>/
            <span>
              <Icon type="down" />
            </span>
            {Math.round(systemInfo.pps.rx_pps)}
            <span>&nbsp;pps</span>
          </p>
        </div>
      </div>
    );

    const ListWapper = () => {
      if (list) {
        return (
          <List
            rowKey="id"
            loading={tasksLoading}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={['', ...list]}
            renderItem={item =>
              item ? (
                <List.Item key={item.taskid}>
                  <Card
                    hoverable
                    className={styles.card}
                    actions={[
                      <a onClick={() => this.previewItem(item.taskid)}>查看详情</a>,
                      <a>导出</a>,
                    ]}
                  >
                    <Card.Meta
                      title={
                        <a onClick={() => this.previewItem(item.taskid)}>{`SST-${item.taskid}`}</a>
                      }
                      description={
                        <div className={styles.item}>
                          {`IP: ${item.ip}`}
                          <br />
                          {`最新扫描时间: ${item.updated_time}`}
                          <br />
                          {`发现漏洞数: ${item.vulncount || 0}`}
                        </div>
                      }
                    />
                  </Card>
                </List.Item>
              ) : (
                <List.Item>
                  <Button
                    type="dashed"
                    className={styles.newButton}
                    onClick={() => router.push('/form/step-form/info')}
                  >
                    <Icon type="plus" /> 新建任务
                  </Button>
                </List.Item>
              )
            }
          />
        );
      }
      return <Empty />;
    };

    return (
      <PageHeaderWrapper
        loading={systemInfoLoading}
        content={pageHeaderContent}
        extraContent={extraContent}
      >
        <div className={styles.cardList}>
          <ListWapper />
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default Workplace;
