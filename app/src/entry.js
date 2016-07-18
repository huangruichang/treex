
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, hashHistory } from 'react-router'
import { App, Repo, DevTools, FileStatePage, HistoryPage } from './containers'
import { listProject } from './actions'

import configureStore from './store/configureStore'

const store = configureStore()

const createElement = (Component, props) => {
  return <Component {...props} store={store}/>
}

const component = (
  <Router history={hashHistory} createElement={createElement}>
    <Route path="/projects" component={App} onEnter={() => { store.dispatch(listProject()) }}/>
    <Route path="/repo/:project" component={Repo}>
      <Route path="history" components={{ page: HistoryPage }}/>
      <Route path="fileState" components={{ page: FileStatePage }}/>
    </Route>
  </Router>
)

/*eslint-disable no-undef*/
if (__DEVTOOLS__) {
/*eslint-disable no-undef*/
  render(
    <Provider store={store}>
      <div>
        {component}
        <DevTools />
      </div>
    </Provider>,
    document.getElementById('root')
  )
} else {
  render(
    <Provider store={store}>
      {component}
    </Provider>,
    document.getElementById('root')
  )
}
