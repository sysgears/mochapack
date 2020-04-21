const mochaPkgJson = import('mocha/package.json')
const installedMochaVersion = mochaPkgJson.then(pkg => pkg.version)
const installedMochaVersionArray = installedMochaVersion.then(v =>
  v.split('.').map(n => parseInt(n, 10))
)
export const installedMochaMajor = installedMochaVersionArray[0]
