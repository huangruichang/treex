
import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import { debounce } from 'lodash'
import History from './History'

const styles = require('./history.scss')

export default class HistoryList extends Component {

  static propTypes = {
    histories: PropTypes.array.isRequired,
    onItemClick: PropTypes.func,
    onScrollBottom: PropTypes.func,
    hasUnCommittedHistory: PropTypes.bool,
    onUnCommittedHistory: PropTypes.func,
    prefix: PropTypes.string,
    tag: PropTypes.string,
    tagCommit: PropTypes.object,
    onLoadAllClick: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      showLoadAll: true,
    }
    this.tagScrollInit = false
  }

  scrollListener(event) {
    if (!this.state.showLoadAll) {
      return
    }
    if (event.target.scrollTop + event.target.offsetHeight >= event.target.scrollHeight) {
      if (!this.listScrollBottomCallback) {
        this.listScrollBottomCallback = debounce(() => {
          this.props.onScrollBottom && this.props.onScrollBottom(this)
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

  hideLoadAll() {
    this.props.onLoadAllClick && this.props.onLoadAllClick()
    this.setState({
      showLoadAll: false,
    })
  }

  scrollToTag() {
    let el = findDOMNode(this)
    let $tag = document.querySelector('.' + styles.tag)
    el.scrollTop = $tag.offsetTop - 50
  }

  render() {

    let loadAll = this.props.tagCommit && this.state.showLoadAll? <div className={styles.loadAll} onClick={::this.hideLoadAll}>加载全部</div> : ''
    if (!this.state.showLoadAll && !this.tagScrollInit) {
      this.tagScrollInit = true
      setTimeout(() => {
        this.scrollToTag()
      }, 1000)
    }

    return (
      <div className={styles.historyList}>
        <div className={styles.th}>
          <div className={styles.grid}>描述</div>
          <div className={styles.grid}>提交</div>
          <div className={styles.grid}>作者</div>
          <div className={styles.grid}>日期</div>
        </div>
        {loadAll}
        {!this.props.hasUnCommittedHistory ? '' :
          <History
            desc={'Uncommitted Changes'}
            commitId={'*'}
            author={'*'}
            date={'*'}
            onClick={this.props.onUnCommittedHistory}
          />
        }
        {this.props.histories.map((obj, index) => {

          let props = Object.assign({}, obj)
          props.key = `${this.props.prefix?(this.props.prefix+'-'):''}repo-history-${index}-${obj.commitId}`
          props.onClick = this.props.onItemClick

          if (this.props.tagCommit && this.props.tagCommit.id().toString() === obj.commitId) {
            props.tag = this.props.tag
          }

          return <History
            {...props}
          />

        })}
      </div>
    )
  }
}
