
import React, { Component, PropTypes } from 'react'

const styles = require('./project.scss')

export default class ProjectItem extends Component {

  static propTypes = {
    name: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className={styles.projectItem} onClick={this.props.onClick} tabIndex={-1}>
        <div className={styles.left}>
          <i className={`txIcon bucket ${styles.bucket}`} />
          <div>{ this.props.name }</div>
        </div>
      </div>
    )
  }
}
