import { Compiler, Stats } from 'webpack'
import { MOCHAPACK_NAME } from '../../util/constants'

export default function registerReadyCallback(
  compiler: Compiler,
  cb: (err: (Error | string) | null, stats: Stats | null) => void
) {
  compiler.hooks.failed.tap(MOCHAPACK_NAME, cb)
  compiler.hooks.done.tap(MOCHAPACK_NAME, (stats: Stats) => {
    if (stats.hasErrors()) {
      const jsonStats = stats.toJson()
      const [err] = jsonStats.errors
      cb(err, stats)
    } else {
      cb(null, stats)
    }
  })
}
