import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
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
          key: 'Ant Design Pro',
          title: '前端框架采用Ant Design Pro',
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
  </Footer>
);
export default FooterView;
