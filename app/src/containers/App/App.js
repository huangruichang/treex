
import React, { Component } from 'react'
import { findProject } from '../../actions'
import ProjectList from '../../components/ProjectList/ProjectList'


//const styles = require('./App.scss')

export default class App extends Component {

  constructor(props) {
    super(props)
  }

  findProject() {
    const { store } = this.props
    if (store) {
      store.dispatch(findProject())
    }
  }

  render() {
    return (
      <div>
        <div onClick={::this.findProject}>+新仓库</div>
        <ProjectList />
      </div>
    )
  }
}
