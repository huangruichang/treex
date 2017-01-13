
import React, { Component, PropTypes } from 'react'

const styles = require('./history.scss')

export default class History extends Component {

  static propTypes = {
    commitId: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    style: PropTypes.object,
    tag: PropTypes.string,
  }

  constructor(props) {
    super(props)
  }

  getZhTime(date) {
    const _date = new Date(date)
    const meridiem  = _date.getHours() < 12 ? ' 上午' : '下午'
    const hours = _date.getHours() < 12 ? _date.getHours() : _date.getHours() - 12
    const dateStr = `${_date.getFullYear()}年${_date.getMonth()}月${_date.getDate()}日 ${meridiem}${hours}:${_date.getMinutes()}`
    return dateStr
  }

  render() {
    const date = this.props.date === '*'? this.props.date : this.getZhTime(this.props.date)
    const tag = this.props.tag?<span className={styles.tag}><i className={'tag'}></i>{this.props.tag}</span>:''
    return (
      <div tabIndex={-1} className={styles.historyItem} onClick={() => {
        this.props.onClick(this.props.commitId)
      }} style={this.props.style}>
        <div className={`${styles.grid} ellipsis`}>{this.props.desc}</div>
        <div className={`${styles.grid} ${styles.commitId} ellipsis`}>
          {tag}
          {this.props.commitId}
        </div>
        <div className={`${styles.grid} ellipsis`}>{this.props.author}</div>
        <div className={`${styles.grid} ellipsis`}>{date}</div>
      </div>
    )
  }
}
