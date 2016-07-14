
import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import { debounce } from 'lodash'
import History from './History'

const styles = require('./history.scss')

export default class HistoryList extends Component {

  static propTypes = {
    histories: PropTypes.array.isRequired,
    onItemClick: PropTypes.func,
    onScrollBottom: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
  }

  scrollListener(event) {
    if (event.target.scrollTop + event.target.offsetHeight >= event.target.scrollHeight) {
      if (!this.listScrollBottomCallback) {
        this.listScrollBottomCallback = debounce(() => {
          this.props.onScrollBottom(this)
        }, 500)
      }
      this.listScrollBottomCallback()
    }
  }

  componentDidMount() {
    this.attachScrollListener()
  }

  componentDidUpdate() {
    this.attachScrollListener()
  }

  componentWillUnmount() {
    this.detachScrollListener()
  }

  attachScrollListener() {
    let el = findDOMNode(this)
    el.addEventListener('scroll', ::this.scrollListener)
  }

  detachScrollListener() {
    let el = findDOMNode(this)
    el.removeEventListener('scroll', ::this.scrollListener)
  }

  render() {
    return (
      <div className={styles.historyList}>
        <div className={styles.th}>
          <div className={styles.grid}>描述</div>
          <div className={styles.grid}>提交</div>
          <div className={styles.grid}>作者</div>
          <div className={styles.grid}>日期</div>
        </div>
        {this.props.histories.map((obj, index) => {
          return <History
                    desc={obj.desc}
                    commitId={obj.commitId}
                    author={obj.author}
                    date={obj.date}
                    key={`repo-history-${index}`}
                    onClick={this.props.onItemClick}
                />
        })}
      </div>
    )
  }
}
