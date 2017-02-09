import React from 'react';
import { connect } from 'dva';
import styles from './Test.css';

function Test({ location, dispatch, test }) {
  const { name } = test
  return (
    <div className={styles.normal}>
      <span>from state: {test.name}</span>
      <br></br>
      <span>from param: {name}</span>
    </div>
  );
}

function mapStateToProps({ test }) {
  return {test};
}

export default connect(mapStateToProps)(Test);
