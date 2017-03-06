import React from 'react'
import {Router} from 'dva/router'
import App from './routes/app'

const cached = {}
const registerModel = (app, model) => {
  if (!cached[model.namespace]) {
    app.model(model)
    cached[model.namespace] = 1
  }
}

export default function ({history, app}) {
  const routes = [
    {
      path: '/',
      component: App,
      getIndexRoute (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/dashboard'))
          cb(null, {component: require('./routes/dashboard')})
        }, 'dashboard')
      },
      childRoutes: [
        {
          path: 'dashboard',
          name: 'dashboard',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/dashboard'))
              cb(null, require('./routes/dashboard'))
            }, 'dashboard')
          }
        }, {
          path: 'users',
          name: 'users',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/users'))
              cb(null, require('./routes/users'))
            }, 'users')
          }
        }, {
          path: 'ui/ico',
          name: 'ui/ico',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/ui/ico'))
            }, 'ui-ico')
          }
        }, {
          path: 'ui/search',
          name: 'ui/search',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/ui/search'))
            }, 'ui-search')
          }
        },{
          path: 'test',
          name: 'test',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/test'))
              cb(null, require('./routes/Test'))
            })
          }
        },
        {
          path: 'eitSourceAccount',
          name: 'eitSourceAccount',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/EitSourceAccount'))
              cb(null, require('./routes/EitSourceAccount'))
            })
          }
        }, {
          path: '*',
          name: 'error',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/error'))
            }, 'error')
          }
        }
        // ,{
        //   path: 'project/index',
        //   name: 'project/index',
        //   getComponent (nextState, cb) {
        //     require.ensure([], require => {
        //       cb(null, require('./routes/project/Index.js'))
        //     })
        //   }
        // }
      ]
    }
  ]

  return <Router history={history} routes={routes} />
}
