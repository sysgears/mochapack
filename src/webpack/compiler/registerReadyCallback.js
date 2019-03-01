// @flow
import type { Compiler, Stats } from '../types';

export default function registerReadyCallback(compiler: Compiler, cb: (err: ?(Error | string), stats: ?Stats) => void) {
  compiler.hooks.failed.tap('mochapack', cb);
  compiler.hooks.done.tap('mochapack', (stats: Stats) => {
    if (stats.hasErrors()) {
      const jsonStats = stats.toJson();
      const [err] = jsonStats.errors;
      cb(err, stats);
    } else {
      cb(null, stats);
    }
  });
}
