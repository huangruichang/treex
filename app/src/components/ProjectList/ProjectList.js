
import React, { Component, PropTypes } from 'react'
import ProjectItem from './ProjectItem'

export default class ProjectList extends Component {

  static propTypes = {
    onItemClick: PropTypes.func.isRequired,
    projects: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        {this.props.projects.map((obj, index) => {
          return <ProjectItem name={obj.name} key={index} onClick={() => { this.props.onItemClick(obj.name) }} />
        })}
      </div>
    )
  }
}
