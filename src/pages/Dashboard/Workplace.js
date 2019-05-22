import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Card, List, Avatar, Button, Icon, Tooltip, Progress } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './Workplace.less';

@connect(({ user, project, activities, chart, loading }) => ({
  currentUser: user.currentUser,
  project,
  activities,
  chart,
  currentUserLoading: loading.effects['user/fetchCurrent'],
  projectLoading: loading.effects['project/fetchNotice'],
  activitiesLoading: loading.effects['activities/fetchList'],
}))
class Workplace extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
    dispatch({
      type: 'project/fetchNotice',
    });
    dispatch({
      type: 'activities/fetchList',
    });
    dispatch({
      type: 'chart/fetch',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
  }

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
    const { currentUser, currentUserLoading, loading } = this.props;

    const list = [];
    for (let i = 0; i < 20; i += 1) {
      list.push({
        id: `fake-list-${i}`,
        title: `SST-${i}`,
        cover: 'cover',
        status: ['active', 'exception', 'normal'][i % 3],
        percent: Math.ceil(Math.random() * 50) + 50,
        updatedAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i),
        createdAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i),
        subDescription: 'subDescription',
        description: (
          <div>
            <p>IP: 127.0.0.1 | 发现高危漏洞数: 0</p>
            <Progress
              percent={parseInt(Math.random() * (100 - 80 + 1) + 80, 10)}
              style={{ width: '99%' }}
            />
          </div>
        ),
        activeUser: Math.ceil(Math.random() * 100000) + 100000,
        newUser: Math.ceil(Math.random() * 1000) + 1000,
        star: Math.ceil(Math.random() * 100) + 100,
        like: Math.ceil(Math.random() * 100) + 100,
        message: Math.ceil(Math.random() * 10) + 10,
        author: 'SimpleScan',
      });
    }

    const pageHeaderContent =
      currentUser && Object.keys(currentUser).length ? (
        <div className={styles.pageHeaderContent}>
          <div className={styles.content}>
            <div className={styles.contentTitle}>外网IP: 223.129.64.5</div>
            <div>内网IP: 192.168.1.1</div>
          </div>
        </div>
      ) : null;

    const extraContent = (
      <div className={styles.extraContent}>
        <div className={styles.statItem}>
          <p>CPU</p>
          <p>56%</p>
        </div>
        <div className={styles.statItem}>
          <p>内存</p>
          <p>70%</p>
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
            20<span>&nbsp;Kbps</span> /{' '}
            <span>
              <Icon type="down" />
            </span>
            1<span>&nbsp;Kbps</span>
          </p>
        </div>
      </div>
    );

    return (
      <PageHeaderWrapper
        loading={currentUserLoading}
        content={pageHeaderContent}
        extraContent={extraContent}
      >
        <div className={styles.cardList}>
          <List
            rowKey="id"
            loading={loading}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={['', ...list]}
            renderItem={item =>
              item ? (
                <List.Item key={item.id}>
                  <Card hoverable className={styles.card} actions={[<a>查看详情</a>, <a>导出</a>]}>
                    <Card.Meta
                      title={<a>{item.title}</a>}
                      description={<div className={styles.item}>{item.description}</div>}
                    />
                  </Card>
                </List.Item>
              ) : (
                <List.Item>
                  <Button type="dashed" className={styles.newButton}>
                    <Icon type="plus" /> 新建任务
                  </Button>
                </List.Item>
              )
            }
          />
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default Workplace;
