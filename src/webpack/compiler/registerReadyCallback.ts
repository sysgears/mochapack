import { Compiler, Stats } from 'webpack'
import { MOCHAPACK_NAME } from '../../util/constants'

export default function registerReadyCallback(
  compiler: Compiler,
  cb: (err: Error, stats: Stats) => void
  ) {
  compiler.hooks.failed.tap(MOCHAPACK_NAME, (error: Error) => cb(error, null))
  compiler.hooks.done.tap(MOCHAPACK_NAME, (stats: Stats) => {
    if (stats.hasErrors()) {
      const jsonStats = stats.toJson()
      const [err] = jsonStats.errors
      cb(err as Error, stats)
    } else {
      cb(null, stats)
    }
  })
}
