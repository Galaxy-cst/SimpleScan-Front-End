import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import DocumentTitle from 'react-document-title';
import SelectLang from '@/components/SelectLang';
import styles from './UserLayout.less';
import logo from '../assets/logo.svg';
import getPageTitle from '@/utils/getPageTitle';

class UserLayout extends Component {
  componentDidMount() {
    const {
      dispatch,
      route: { routes, authority },
    } = this.props;
    dispatch({
      type: 'menu/getMenuData',
      payload: { routes, authority },
    });
  }

  render() {
    const {
      children,
      location: { pathname },
      breadcrumbNameMap,
    } = this.props;
    return (
      <DocumentTitle title={getPageTitle(pathname, breadcrumbNameMap)}>
        <div className={styles.container}>
          <div className={styles.lang}>
            <SelectLang />
          </div>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <Link to="/">
                  <img alt="logo" className={styles.logo} src={logo} />
                  <span className={styles.title}>SimpleScan</span>
                </Link>
              </div>
              <div className={styles.desc}>简单易用、可定制的漏洞扫描器</div>
            </div>
            {children}
          </div>
          <GlobalFooter
            links={[
              {
                key: 'SimpleScan',
                title: 'SimpleScan首页',
                href: 'https://simplescan.gltlab.cn',
                blankTarget: true,
              },
              {
                key: 'github',
                title: <Icon type="github" />,
                href: 'https://github.com/Galaxy-cst/SimpleScan',
                blankTarget: true,
              },
              {
                key: 'SimpleScan',
                title: '前端框架采用ADP',
                href: 'https://pro.ant.design',
                blankTarget: true,
              },
            ]}
            copyright={
              <Fragment>
                Copyright <Icon type="copyright" /> 2019 Galaxy-cst
              </Fragment>
            }
          />
        </div>
      </DocumentTitle>
    );
  }
}

export default connect(({ menu: menuModel }) => ({
  menuData: menuModel.menuData,
  breadcrumbNameMap: menuModel.breadcrumbNameMap,
}))(UserLayout);
