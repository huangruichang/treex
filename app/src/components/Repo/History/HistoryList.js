
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import History from './History'

const mapStateToProps = (state) => {
  return {
    histories: state.repo.histories,
  }
}

@connect(
  mapStateToProps
)
export default class HistoryList extends Component {

  static propTypes = {
    histories: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        {this.props.histories.map((obj, index) => {
          return <History
                    desc={obj.desc}
                    commitId={obj.commitId}
                    author={obj.author}
                    date={obj.date}
                    key={`repo-history-${index}`}
                  />
        })}
      </div>
    )
  }
}
