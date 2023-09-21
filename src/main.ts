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
    // set lookup & Backward lookup collections base on an API direction
    const [lookupCollection, reverseLookupCollection] =
      apiDirection === ApiDirection.Forward
        ? [allStandardFields, allSupplierFields]
        : [allSupplierFields, allStandardFields]

    const [lookupElementId] = [...lookupCollection.entries()].find(
      ([key, value]) => {
        return value.name === characteristics[i].name
      }
    ) as [number, Characteristic]
    if (lookupElementId === undefined) {
      continue
    }

    const vendorFieldIds = allSupplierMapping.reduce(
      (acc: number[], currentVal) => {
        // Use forward or Backward lookup based on the request direction
        if (
          apiDirection === ApiDirection.Forward &&
          lookupElementId === currentVal.fieldId
        ) {
          return [...acc, currentVal.supplierFieldId]
        } else if (
          apiDirection === ApiDirection.Backward &&
          lookupElementId === currentVal.supplierFieldId
        ) {
          return [...acc, currentVal.fieldId]
        }
        return acc
      },
      []
    )

    const replacements: Characteristic[] = vendorFieldIds
      .map((elem, index) => reverseLookupCollection.get(vendorFieldIds[index]))
      .filter((elem): elem is Characteristic => {
        return !!(elem !== undefined)
      })

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
