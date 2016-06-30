
import React, { Component, PropTypes } from 'react'
import History from './History'

const styles = require('./history.scss')

export default class HistoryList extends Component {

  static propTypes = {
    histories: PropTypes.array.isRequired,
    onItemClick: PropTypes.func,
  }

  constructor(props) {
    super(props)
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
