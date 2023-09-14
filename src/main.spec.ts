// import { expect, test } from '@jest/globals'

import {
  mapCharacteristics,
  mapGatewayCharacteristics,
  mapSupplierCharacteristics
} from './main'
import { type Characteristic, ApiDirection } from './shared'

enum SupplierTestType {
  OneToOne = 'SUPPLIER1',
  OneToMany = 'SUPPLIER2',
  ManyToOne = 'SUPPLIER3'
}

test('Test one-to-one forward', async () => {
  const input: Characteristic[] = [{ name: 'LINE_ID', value: '12345' }]
  const expected: Characteristic[] = [
    { name: 'LINE_IDENTIFIER', value: '12121' }
  ]
  const result: Characteristic[] = await mapCharacteristics(
    input,
    SupplierTestType.OneToOne,
    ApiDirection.Forward
  )

  expect(result.length).toEqual(expected.length)
  expect(new Set(result)).toEqual(new Set(expected))
})

test('Test one-to-one Backward', async () => {
  const input: Characteristic[] = [{ name: 'LINE_IDENTIFIER', value: '12121' }]
  const expected: Characteristic[] = [{ name: 'LINE_ID', value: '12345' }]
  const result: Characteristic[] = await mapCharacteristics(
    input,
    SupplierTestType.OneToOne,
    ApiDirection.Backward
  )

  expect(result.length).toEqual(expected.length)
  expect(new Set(result)).toEqual(new Set(expected))
})

test('Test one-to-many forward', async () => {
  const input: Characteristic[] = [{ name: 'PROFILE', value: '1' }]
  const expected: Characteristic[] = [
    { name: 'UPSTREAM', value: '12' },
    { name: 'DOWNSTREAM', value: '1000' }
  ]
  const result: Characteristic[] = await mapCharacteristics(
    input,
    SupplierTestType.OneToMany,
    ApiDirection.Forward
  )

  expect(result.length).toEqual(expected.length)
  expect(new Set(result)).toEqual(new Set(expected))
})

test('Test one-to-many Backward', async () => {
  const input: Characteristic[] = [
    { name: 'UPSTREAM', value: '12' },
    { name: 'DOWNSTREAM', value: '1000' }
  ]
  const expected: Characteristic[] = [{ name: 'PROFILE', value: '1' }]
  const result: Characteristic[] = await mapCharacteristics(
    input,
    SupplierTestType.OneToMany,
    ApiDirection.Backward
  )

  expect(result.length).toEqual(expected.length)
  expect(new Set(result)).toEqual(new Set(expected))
})

test('Test many-to-one forward', async () => {
  const input: Characteristic[] = [
    { name: 'SERVICE_ID', value: '33' },
    { name: 'RETAILER_ID', value: '44' }
  ]
  const expected: Characteristic[] = [{ name: 'COMPANY_ID', value: '66' }]
  const result: Characteristic[] = await mapCharacteristics(
    input,
    SupplierTestType.ManyToOne,
    ApiDirection.Forward
  )
  expect(result.length).toEqual(expected.length)
  expect(new Set(result)).toEqual(new Set(expected))
})

test('Test many-to-one Backward', async () => {
  const input: Characteristic[] = [{ name: 'COMPANY_ID', value: '66' }]
  const expected: Characteristic[] = [
    { name: 'SERVICE_ID', value: '33' },
    { name: 'RETAILER_ID', value: '44' }
  ]
  const result: Characteristic[] = await mapCharacteristics(
    input,
    SupplierTestType.ManyToOne,
    ApiDirection.Backward
  )

  expect(result.length).toEqual(expected.length)
  expect(new Set(result)).toEqual(new Set(expected))
})

// now test main 2 mapping methods wrappers

// this test is very similar to "Test one-to-one forward" test
test('Test map gateway characteristics', async () => {
  const input: Characteristic[] = [{ name: 'LINE_ID', value: '12345' }]
  const expected: Characteristic[] = [
    { name: 'LINE_IDENTIFIER', value: '12121' }
  ]

  const result = await mapGatewayCharacteristics(
    input,
    SupplierTestType.OneToOne
  )

  expect(result.length).toEqual(expected.length)
  expect(new Set(result)).toEqual(new Set(expected))
})

// this test is very similar to "Test one-to-one Backward"
test('Test map supplier characteristics', async () => {
  const input: Characteristic[] = [{ name: 'LINE_IDENTIFIER', value: '12121' }]
  const expected: Characteristic[] = [{ name: 'LINE_ID', value: '12345' }]

  const result = await mapSupplierCharacteristics(
    input,
    SupplierTestType.OneToOne
  )

  expect(result.length).toEqual(expected.length)
  expect(new Set(result)).toEqual(new Set(expected))
})
