
import React, { Component, PropTypes } from 'react'
import ProjectItem from './ProjectItem'

const styles = require('./project.scss')

export default class ProjectList extends Component {

  static propTypes = {
    onItemClick: PropTypes.func.isRequired,
    onCloseClick: PropTypes.func.isRequired,
    projects: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className={styles.projectList}>
        {this.props.projects.map((obj, index) => {
          return <ProjectItem
            name={obj.name}
            key={index}
            onClick={() => { this.props.onItemClick(obj.name) }}
            onCloseClick={(e) => {this.props.onCloseClick(e, obj.name)}}
          />
        })}
      </div>
    )
  }
}
