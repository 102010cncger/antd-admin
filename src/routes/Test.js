import React from 'react';
import { connect } from 'dva';
import styles from './Test.css';

function Test({ location, dispatch, test }) {
  return (
    <div className={styles.normal}>
      Route Component: Test{test.name}
    </div>
  );
}

function mapStateToProps({ test }) {
  return {test};
}

export default connect(mapStateToProps)(Test);
