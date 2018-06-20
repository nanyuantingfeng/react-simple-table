/**************************************************
 * Created by nanyuantingfeng on 21/09/2017 15:07.
 **************************************************/

export function is (property, fn) {
  const {dataType} = property
  if (!dataType) return false
  const {type, entity} = dataType
  return type === 'ref' && fn(entity)
}

export function isBaseData (property) {
  return is(property, e => e.startsWith('basedata.Dimension.'))
}

export function isCity (property) {
  return is(property, e => e.startsWith('basedata.city'))
}

export function isDepartments (property) {
  return is(property, e => e === 'organization.Department')
}

export function isStaffs (property) {
  return is(property, e => e === 'organization.Staff')
}

export function isPayeeInfos (property) {
  return is(property, e => e === 'pay.PayeeInfo')
}

export function isSpecification (property) {
  return is(property, e => e === 'form.Specification.Versioned')
}
