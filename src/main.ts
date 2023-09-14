import { getStandardFields, getSupplierData } from './dataService'
import {
  type SupplierId,
  type Characteristic,
  type FieldsMap,
  type CharacteristicsMapper,
  ApiDirection
} from './shared'

/**
 * This method is an inner implementation for our 2 main interface methods,
 * it does a bidirectional mapping
 */
export async function mapCharacteristics (
  characteristics: Characteristic[],
  supplier: SupplierId,
  apiDirection: ApiDirection
): Promise<Characteristic[]> {
  const supplierData = getSupplierData(supplier)
  if (supplierData === undefined) {
    return characteristics // empty supplier, etc.
  }
  // these need to be retrieved from persistent storage and cached
  const allStandardFields = getStandardFields() // all standard fields
  const allSupplierFields = supplierData.fields // suplier's fields
  const allSupplierMapping = supplierData.mapping // supplier's mapping with standard fields

  const output: Characteristic[] = []
  for (let i = 0; i < characteristics.length; i++) {
    const inputElem = characteristics[i]
    const replacements: Characteristic[] = []

    let lookupElementId: number | undefined

    // set lookup & Backward lookup collections base on an API direction
    const lookupCollection: FieldsMap =
      apiDirection === ApiDirection.Forward
        ? allStandardFields
        : allSupplierFields

    const BackwardlookupCollection: FieldsMap =
      apiDirection === ApiDirection.Forward
        ? allSupplierFields
        : allStandardFields

    for (const [key, value] of lookupCollection.entries()) {
      if (value.name === inputElem.name) {
        lookupElementId = key
        break
      }
    }

    if (lookupElementId === undefined) {
      continue
    }
    let vendorFieldIds: number[] = []

    vendorFieldIds = allSupplierMapping.reduce((acc: number[], currentVal) => {
      // Use forward or Backward lookup based on the request direction
      if (
        apiDirection === ApiDirection.Forward &&
        lookupElementId === currentVal.fieldId
      ) {
        acc.push(currentVal.supplierFieldId)
      } else if (
        apiDirection === ApiDirection.Backward &&
        lookupElementId === currentVal.supplierFieldId
      ) {
        acc.push(currentVal.fieldId)
      }
      return acc
    }, [])

    for (let k = 0; k < vendorFieldIds.length; k++) {
      // look for replacement mapping
      const replacement = BackwardlookupCollection.get(vendorFieldIds[k])
      if (replacement !== undefined) {
        replacements.push(replacement)
      }
    }

    if (replacements.length > 0) {
      // replace with the mapped elements, optional field value mechanism is missing - needs to be improved
      output.push(...replacements)
    } else {
      // no mapping found, use original value instead
      output.push(characteristics[i])
    }
  }

  // filter out possible duplicates. Likely possible to do it in a simpler way by using Sets or similarly - tbd.
  return output.filter(
    (value, index, self) =>
      index === self.findIndex((t) => t.name === value.name)
  )
}

export const mapGatewayCharacteristics: CharacteristicsMapper = async (
  characteristics,
  supplier
) => {
  return await mapCharacteristics(
    characteristics,
    supplier,
    ApiDirection.Forward
  )
}

export const mapSupplierCharacteristics: CharacteristicsMapper = async (
  characteristics,
  supplier
) => {
  return await mapCharacteristics(
    characteristics,
    supplier,
    ApiDirection.Backward
  )
}
