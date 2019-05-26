import React from 'react';
import ReactJson from 'react-json-view';
import styles from './index.less';

const ArticleListContent = ({ data: { detail, updatedTime } }) => (
  <div className={styles.listContent}>
    <div className={styles.description}>
      <ReactJson src={detail} collapsed="1" />
    </div>
    <div className={styles.extra}>
      由<a href="http://github.com/Galaxy-cst/SimpleScan">SimpleScan</a>添加
      <em>{updatedTime}</em>
    </div>
  </div>
);

export default ArticleListContent;
