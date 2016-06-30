
import React, { Component, PropTypes } from 'react'

const styles = require('./history.scss')

export default class History extends Component {

  static propTypes = {
    commitId: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    onClick: PropTypes.func,
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
    const date = this.getZhTime(this.props.date)
    return (
      <div className={styles.historyItem} onClick={() => {
        this.props.onClick(this.props.commitId)
      }}>
        <div className={styles.grid}>{this.props.desc}</div>
        <div className={`${styles.grid} ${styles.commitId} ${styles.ellipsis}`}>{this.props.commitId}</div>
        <div className={styles.grid}>{this.props.author}</div>
        <div className={styles.grid}>{date}</div>
      </div>
    )
  }
}
