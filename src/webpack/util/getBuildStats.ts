import path from 'path'
import { Stats } from 'webpack'
import Chunk from 'webpack/lib/Chunk'
import Module from 'webpack/lib/Module'
import sortChunks from './sortChunks'
import getAffectedModuleIds from './getAffectedModuleIds'

export type BuildStats = {
  affectedModules: Array<number | string>
  affectedFiles: Array<string>
  entries: Array<string>
}

export default function getBuildStats(
  stats: Stats,
  outputPath: string
): BuildStats {
  const { chunks, chunkGraph, chunkGroups, modules, moduleGraph, builtModules } = stats.compilation

  const sortedChunks = sortChunks(chunks, chunkGroups)
  const affectedModules = getAffectedModuleIds(chunks, chunkGraph, modules, moduleGraph, builtModules)

  const entries = []
  const js = []
  const pathHelper = f => path.join(outputPath, f)

  sortedChunks.forEach((chunk: Chunk) => {
    const files = Array.from(chunk.files)

    if (chunk.isOnlyInitial()) {
      // only entry files
      const entry = files[0]
      entries.push(entry)
    }

    if (
      chunkGraph
        .getChunkModules(chunk)
        .some((module: Module) => affectedModules.indexOf(chunkGraph.getModuleId(module)) !== -1)
    ) {
      files.forEach((file: string) => {
        if (/\.js$/.test(file)) {
          js.push(file)
        }
      })
    }
  })

  const buildStats: BuildStats = {
    affectedModules,
    affectedFiles: js.map(pathHelper),
    entries: entries.map(pathHelper)
  }

  return buildStats
}
