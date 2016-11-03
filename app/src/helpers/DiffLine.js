
export default class DiffLine {

  constructor(line) {
    this._origin = line.origin
    this._oldLineno = line.oldLineno
    this._newLineno = line.newLineno
    this._content = line.content
  }

  origin() {
    return this._origin
  }

  oldLineno() {
    return this._oldLineno
  }

  newLineno() {
    return this._newLineno
  }

  content() {
    return this._content
  }
}
