
const exports = {
  getLocalBranches(branches = []) {
    let localBranches = branches.filter((branch) => {
      return branch.name().indexOf('refs/heads') != -1
    })
    localBranches = localBranches.map((branch) => {
      return {
        name: branch.name().replace(/refs\/heads\//g, ''),
        path: branch.name(),
        isHead: branch.isHead(),
        fullName: branch.name(),
      }
    })
    return localBranches
  },

  getRemoteBranches(branches = []) {
    let remoteBranches = branches.filter((branch) => {
      return branch.name().indexOf('refs/remotes') != -1
    })
    remoteBranches = remoteBranches.map((branch) => {
      return {
        name: branch.name().replace(/refs\/remotes\//g, ''),
        path: branch.name(),
        isHead: branch.isHead(),
        fullName: branch.name(),
      }
    })
    return remoteBranches
  },

  getOrigins(remoteBranches = []) {
    let origins = []
    remoteBranches.map((branch) => {
      let remoteOrigin = branch.path.split('\/')[2]
      let exist = (origins, origin) => {
        let flag = false
        origins.map((value) => {
          if (value.origin === origin) {
            flag = true
          }
        })
        return flag
      }
      if (!exist(origins, remoteOrigin)) {
        origins.push({
          origin: remoteOrigin,
          branches: [branch],
        })
      } else {
        origins.map((origin) => {
          let remoteOrigin = branch.path.split('\/')[2]
          if (remoteOrigin === origin.origin) {
            origin.branches.push(branch)
          }
        })
      }
    })
    return origins
  },

  getSelectedDefaultBranch(branches = [], branch = 'master') {
    let result = {}
    for (let obj of branches) {
      if (obj.fullName.indexOf(branch) != -1) {
        result = obj
      }
    }
    return result
  },

  getSelectedDefaultOrigin(origins = [], origin = 'origin') {
    let result = {}
    for (let obj of origins) {
      if (origin.indexOf(obj.origin) != -1) {
        result = obj
      }
    }
    return result
  },
  
}

export default exports
