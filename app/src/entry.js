
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, hashHistory } from 'react-router'
import { ipcRenderer } from 'electron'
import {
  App,
  Repo,
  DevTools,
  FileStatePage,
  HistoryPage,
  BranchHistoryPage,
  CheckoutRemotePage,
  StashDetailPage,
  StashModalPage,
} from './containers'
import { listProject, refreshSideBar } from './actions'

import configureStore from './store/configureStore'

const store = configureStore()

let projectName
let notMainMarked

const createElement = (Component, props) => {
  return <Component {...props} store={store}/>
}

const component = (
  <Router history={hashHistory} createElement={createElement}>
    <Route path="/projects" component={App} onEnter={() => {
      notMainMarked = true
      store.dispatch(listProject())
    }}/>
    <Route path="/repo/:project" component={Repo}>
      <Route path="history" components={{ page: HistoryPage }}/>
      <Route path="fileState(/:action)" components={{ page: FileStatePage }}/>

      <Route path="branches/:branch" components={{ page: BranchHistoryPage }}/>
      <Route path="stashes/:index" components={{ page: StashDetailPage }}/>
    </Route>
    <Route path="/checkout/remote/:project/:branch" component={CheckoutRemotePage}/>
    <Route path="/stash/:action/:project/:index" component={StashModalPage}/>
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

ipcRenderer.on('set.projectName', (event, data) => {
  if (!projectName && !notMainMarked) {
    projectName = data.projectName
  }
})

ipcRenderer.on('goto.main', () => {
  refreshSideBar(projectName, store)
  hashHistory.push(`/repo/${projectName}/history`)
})

ipcRenderer.on('refresh.sidebar', () => {
  refreshSideBar(projectName, store)
})
