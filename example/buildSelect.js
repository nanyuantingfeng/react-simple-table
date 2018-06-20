/**************************************************
 * Created by nanyuantingfeng on 21/09/2017 15:38.
 **************************************************/
import {
  isPayeeInfos,
  isBaseData,
  isDepartments,
  isSpecification,
  isStaffs,
} from './is'

export default function (propertySet) {
  const oo = []

  propertySet.forEach(property => {

    const {name} = property

    if (isBaseData(property)) {
      return oo.push(`${name}(code,name,nameSpell)`)
    }

    if (isDepartments(property)) {
      return oo.push(`${name}(id,name,nameSpell)`)
    }

    if (isSpecification(property)) {
      return oo.push(`${name}(originalId(...),...)`)
    }

    if (isStaffs(property)) {
      return oo.push(`${name}(id,name)`)
    }

    if (isPayeeInfos(property)) {
      return oo.push(`${name}(...)`)
    }

  })

  return oo.join(',')
}
