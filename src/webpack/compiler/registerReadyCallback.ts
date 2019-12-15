import { Compiler, Stats } from 'webpack'

export default function registerReadyCallback(
  compiler: Compiler,
  cb: (err: (Error | string) | null, stats: Stats | null) => void
) {
  compiler.hooks.failed.tap('mochapack', cb)
  compiler.hooks.done.tap('mochapack', (stats: Stats) => {
    if (stats.hasErrors()) {
      const jsonStats = stats.toJson()
      const [err] = jsonStats.errors
      cb(err, stats)
    } else {
      cb(null, stats)
    }
  })
}
