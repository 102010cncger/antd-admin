import React, { PropTypes } from 'react'
import { Button } from 'antd';
import { connect } from 'dva';
import styles from './Test.css';

function Test({ location, dispatch, test }) {
  const { name } = test;
  function testReducers() {
    dispatch({
      type: 'test/testReducers',
      payload:{
        name:"323232"
      }
    })
  }
  function testEffects() {
    dispatch({
      type: 'test/testEffects'
    })
  }
  return (
    <div className={styles.normal}>
      <span>from state: {test.name}</span>
      <br></br>
      <span>from param: {name}</span>
      <Button onClick={testReducers}>testReducers</Button>
      <Button onClick={testEffects}>testEffects</Button>
    </div>
  );
}

function mapStateToProps({ test }) {
  return {test};
}

// Test.propTypes = {
//   test: PropTypes.object,
//   testReducers: PropTypes.func,
//   testEffects: PropTypes.func
// }

export default connect(mapStateToProps)(Test);
