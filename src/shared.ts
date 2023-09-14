export enum ApiDirection { // is requst goint to supplier or back
  Forward,
  Backward
}

export type FieldId = number
export type SupplierId = string
export type FieldsMap = Map<FieldId, Characteristic>
export type SupplierFields = FieldsMap
export type StandardFields = FieldsMap
export type CharacteristicsMapper = (
  characteristics: Characteristic[],
  supplier: string
) => Promise<Characteristic[]>

export interface SupplierFieldMapping {
  fieldId: number
  supplierFieldId: number
}

export interface SupplierData {
  fields: SupplierFields
  mapping: SupplierFieldMapping[]
}

export interface Characteristic {
  name: string
  value: string
}
