import {
  type Characteristic,
  type SupplierId,
  type SupplierData,
  type FieldId,
  type StandardFields
} from './shared'

/**
 * static data for simplicity, in reality comes from DB: structure displayed in db_structure file
 */

export function getSupplierData (supplierId: string): SupplierData | undefined {
  const allSupplierDataMapped: Map<SupplierId, SupplierData> = new Map<
  SupplierId,
  SupplierData
  >([
    [
      'SUPPLIER1',
      {
        fields: new Map<FieldId, Characteristic>([
          [1, { name: 'LINE_IDENTIFIER', value: '12121' }]
        ]),
        mapping: [{ fieldId: 1, supplierFieldId: 1 }]
      }
    ],
    [
      'SUPPLIER2',
      {
        fields: new Map<FieldId, Characteristic>([
          [2, { name: 'UPSTREAM', value: '12' }],
          [3, { name: 'DOWNSTREAM', value: '1000' }]
        ]),
        mapping: [
          { fieldId: 2, supplierFieldId: 2 },
          { fieldId: 2, supplierFieldId: 3 }
        ]
      }
    ],
    [
      'SUPPLIER3',
      {
        fields: new Map<FieldId, Characteristic>([
          [4, { name: 'COMPANY_ID', value: '66' }]
        ]),
        mapping: [
          { fieldId: 3, supplierFieldId: 4 },
          { fieldId: 4, supplierFieldId: 4 }
        ]
      }
    ]
  ])
  return allSupplierDataMapped.get(supplierId)
}

/** get this from DB / cache, etc */
export function getStandardFields (): StandardFields {
  return new Map<FieldId, Characteristic>([
    [1, { name: 'LINE_ID', value: '12345' }],
    [2, { name: 'PROFILE', value: '1' }],
    [3, { name: 'SERVICE_ID', value: '33' }],
    [4, { name: 'RETAILER_ID', value: '44' }]
  ])
}
