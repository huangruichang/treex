
import React, { Component, PropTypes } from 'react'

const styles = require('./icon.scss')

console.log(styles)

export class codeForkIcon extends Component {

  static propTypes = {
    style: PropTypes.object,
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <i style={this.props.style} className={styles.codeFork}></i>
    )
  }
}

export class BucketIcon extends Component {

  static propTypes = {
    style: PropTypes.object,
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <i style={this.props.style} className={styles.bucket}></i>
    )
  }
}
//
export class searchIcon extends Component {

  static propTypes = {
    style: PropTypes.object,
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <i style={this.props.style} className={styles.search}></i>
    )
  }
}

export class settingIcon extends Component {

  static propTypes = {
    style: PropTypes.object,
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <i style={this.props.style} className={styles.setting}></i>
    )
  }
}

export class iconIconCodeFork extends Component {

  static propTypes = {
    style: PropTypes.object,
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <i style={this.props.style} className={styles.iconCodeFork}></i>
    )
  }
}

export class tagIcon extends Component {

  static propTypes = {
    style: PropTypes.object,
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <i style={this.props.style} className={styles.tag}></i>
    )
  }
}

export class cloudIcon extends Component {

  static propTypes = {
    style: PropTypes.object,
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <i style={this.props.style} className={styles.cloud}></i>
    )
  }
}
