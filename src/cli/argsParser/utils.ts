import { camelCase as _camelCase } from 'lodash'

/**
 * Converts top-level keys of an object to camelCase
 *
 * @param obj An object to convert keys for
 */
const camelizeKeys = <T extends Object>(obj: T): T => {
  const output: T = {} as T

  Object.keys(obj).forEach(key => {
    output[_camelCase(key)] = obj[key]
  })

  return output
}

export default { camelizeKeys }
