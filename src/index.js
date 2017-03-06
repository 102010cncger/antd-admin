import './index.html'
import dva from 'dva'
import { browserHistory } from 'dva/router'
import createLoading from 'dva-loading';
import { message } from 'antd';

const ERROR_MSG_DURATION = 3; // 3 秒

// 1. Initialize
const app = dva({
  history: browserHistory,
  onError(error) {
    console.error('app onError -- ', error);
    message.error(error.message, ERROR_MSG_DURATION);
  },
})

// 2. Model

app.model(require('./models/app'))
// app.model(require('./models/dashboard'))
// app.model(require('./models/users'))

// 3. Router
app.router(require('./router'))

// 4. Start
app.start('#root')
