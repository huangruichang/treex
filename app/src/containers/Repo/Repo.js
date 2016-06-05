
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { HistoryList } from '../../components'
import { loadRepo, loadHistories } from '../../actions'

//const styles = require('./Repo.scss')

const mapStateToProps = (state) => {
  return {
    repo: state.repo.repo,
  }
}

@connect(
  mapStateToProps,
)
export default class Repo extends Component {

  static propTypes = {
    store: PropTypes.object,
  }

  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const { store, params } = this.props
    store.dispatch(loadRepo(params.project))
  }

  render() {

    const { repo, store } = this.props
    if (repo) {
      store.dispatch(loadHistories(repo))
    }

    return (
      <div>
        <HistoryList />
      </div>
    )
  }

}
