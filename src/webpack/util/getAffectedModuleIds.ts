import Chunk from 'webpack/lib/Chunk'
import ChunkGraph from 'webpack/lib/ChunkGraph'
import Module from 'webpack/lib/Module'
import ModuleGraph from 'webpack/lib/ModuleGraph'

type ModuleMap = {
  [key: string]: Module
}
type ModuleUsageMap = {
  // child id
  [key: string]: ModuleMap
}
const isBuilt = (module: Module, webpackBuiltModules: WeakSet<Module>): boolean => {
  if (webpackBuiltModules) {
    return webpackBuiltModules.has(module)
  }
  return module.built
}
const getId = (module: any): number | string => module.id

const affectedModules = (
  chunkGraph: ChunkGraph,
  map: ModuleMap,
  usageMap: ModuleUsageMap,
  affected: ModuleMap,
  moduleId: string | number
) => {
  if (typeof affected[moduleId] !== 'undefined') {
    // module was already inspected, stop here otherwise we get into endless recursion
    return
  }
  // module is identified as affected by this function call
  const module = map[moduleId]
  affected[moduleId] = module // eslint-disable-line no-param-reassign

  // next we need to mark all usages aka parents also as affected
  const usages = usageMap[moduleId]
  if (typeof usages !== 'undefined') {
    const ids = Object.keys(usages)
    ids.forEach((id: string) => affectedModules(chunkGraph, map, usageMap, affected, id))
  }
}

/**
 * Builds a map where all modules are indexed by it's id
 * {
 *   [moduleId]: Module
 * }
 */
const buildModuleMap = (chunkGraph: ChunkGraph, modules: Set<Module>): ModuleMap => {
  const moduleMap = Array.from(modules).reduce(
    (memo, module: Module) => ({ ...memo, [chunkGraph.getModuleId(module)]: module }),
    {}
  )
  return moduleMap
}

/**
 * Builds a map with all modules that are used in other modules (child -> parent relation)
 *
 * {
 *  [childModuleId]: {
 *    [parentModuleId]: ParentModule
 *  }
 * }
 *
 * @param chunks Set<Chunk>
 * @param modules Set<Module>
 * @return ModuleUsageMap
 */
const buildModuleUsageMap = (
  chunks: Set<Chunk>,
  chunkGraph: ChunkGraph,
  modules: Set<Module>,
  moduleGraph: ModuleGraph
): ModuleUsageMap => {
  // build a map of all modules with their parent
  // {
  //    [childModuleId]: {
  //      [parentModuleId]: ParentModule
  //    }
  // }
  //
  const moduleUsageMap: ModuleUsageMap = Array.from(modules).reduce(
    (memo, module: Module) => {
      module.dependencies.forEach(dependency => {
        const dependentModule = moduleGraph.getModule(dependency)

        if (!dependentModule) {
          return
        }
        const dependentModuleId = chunkGraph.getModuleId(dependentModule)
        if (typeof memo[dependentModuleId] === 'undefined') {
          memo[dependentModuleId] = {} // eslint-disable-line no-param-reassign
        }
        const moduleId = chunkGraph.getModuleId(module)
        memo[dependentModuleId][moduleId] = module // eslint-disable-line no-param-reassign
      })
      return memo
    },
    {}
  )

  // build a map of all chunks with their modules
  // {
  //    [chunkId]: {
  //      [moduleId]: Module
  //    }
  // }
  const chunkModuleMap: ModuleUsageMap = Array.from(chunks).reduce((memo, chunk: Chunk) => {
    // build chunk map first to get also empty chunks (without modules)
    memo[chunk.id] = {} // eslint-disable-line no-param-reassign
    return memo
  }, {})
  Array.from(modules).reduce((memo, module: Module) => {
    chunkGraph.getModuleChunksIterable(module).forEach((chunk: Chunk) => {
      const moduleId = chunkGraph.getModuleId(module)
      memo[chunk.id][moduleId] = module // eslint-disable-line no-param-reassign
    })
    return memo
  }, chunkModuleMap)

  // detect modules with code split points (e.g. require.ensure) and enhance moduleUsageMap with that information
  modules.forEach((module: Module) => {
    module.blocks // chunkGroup can be invalid in in some cases
      .filter(block => block.chunkGroup != null)
      .forEach(block => {
        // loop through all generated chunks by this module
        Array.from(block.chunkGroup.chunks).map(getId).forEach(chunkId => {
          // and mark all modules of this chunk as a direct dependency of the original module
          Object.values(chunkModuleMap[chunkId] as ModuleMap).forEach(
            (childModule: any) => {
              const childModuleId = chunkGraph.getModuleId(childModule)
              if (typeof moduleUsageMap[childModuleId] === 'undefined') {
                moduleUsageMap[childModuleId] = {}
              }
              const moduleId = chunkGraph.getModuleId(module)
              moduleUsageMap[childModuleId][moduleId] = module
            }
          )
        })
      })
  })

  return moduleUsageMap
}

/**
 * Builds a list with ids of all affected modules in the following way:
 *  - affected directly by a file change
 *  - affected indirectly by a change of it's dependencies and so on
 *
 * @param chunks Set<Chunk>
 * @param modules Set<Module>
 * @return {Array.<number>}
 */
export default function getAffectedModuleIds(
  chunks: Set<Chunk>,
  chunkGraph: ChunkGraph,
  modules: Set<Module>,
  moduleGraph: ModuleGraph,
  webpackBuiltModules?: WeakSet<Module>
): Array<number | string> {
  const moduleMap: ModuleMap = buildModuleMap(chunkGraph, modules)
  const moduleUsageMap: ModuleUsageMap = buildModuleUsageMap(chunks, chunkGraph, modules, moduleGraph)

  const builtModules = Array.from(modules).filter(m => isBuilt(m, webpackBuiltModules))
  const affectedMap: ModuleMap = {}
  builtModules.forEach((module: Module) => {
    const moduleId: string = chunkGraph.getModuleId(module)
    affectedModules(chunkGraph, moduleMap, moduleUsageMap, affectedMap, moduleId)
  })

  return Object.values(affectedMap).map(m => chunkGraph.getModuleId(m))
}
