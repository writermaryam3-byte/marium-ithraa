import { describe, it, expect } from 'vitest'
import { getApiErrorMessage, getValidationErrors, buildHeaders } from './utils'

describe('getApiErrorMessage', () => {
  it('should return string data directly', () => {
    expect(getApiErrorMessage('Something went wrong')).toBe('Something went wrong')
  })

  it('should return message from object', () => {
    expect(getApiErrorMessage({ message: 'Validation failed' })).toBe('Validation failed')
  })

  it('should return array of messages joined', () => {
    expect(getApiErrorMessage({ message: ['Error 1', 'Error 2'] })).toBe('Error 1, Error 2')
  })

  it('should return errors from errors property', () => {
    expect(getApiErrorMessage({ errors: { email: 'Invalid email', name: 'Name required' } })).toBe(
      'Invalid email, Name required',
    )
  })

  it('should return fallback message for invalid data', () => {
    expect(getApiErrorMessage(null)).toBe('Request failed')
    expect(getApiErrorMessage(undefined)).toBe('Request failed')
    expect(getApiErrorMessage(123)).toBe('Request failed')
  })
})

describe('getValidationErrors', () => {
  it('should extract validation errors from errors object', () => {
    expect(
      getValidationErrors({ errors: { email: ['Invalid email'], name: ['Required'] } }),
    ).toEqual({
      email: ['Invalid email'],
      name: ['Required'],
    })
  })

  it("should extract from message if it's an object", () => {
    expect(getValidationErrors({ message: { email: ['Invalid email'] } })).toEqual({
      email: ['Invalid email'],
    })
  })

  it('should return undefined if no valid errors', () => {
    expect(getValidationErrors('error')).toBeUndefined()
    expect(getValidationErrors(null)).toBeUndefined()
    expect(getValidationErrors({})).toBeUndefined()
  })
})

describe('buildHeaders', () => {
  it('should add content type', () => {
    expect(buildHeaders()).toEqual({ 'Content-Type': 'application/json' })
  })

  it('should add Authorization header with token', () => {
    expect(buildHeaders('test-token')).toEqual({
      'Content-Type': 'application/json',
      Authorization: 'Bearer test-token',
    })
  })

  it('should merge additional headers', () => {
    expect(buildHeaders('test-token', { 'X-Custom': 'value' })).toEqual({
      'Content-Type': 'application/json',
      Authorization: 'Bearer test-token',
      'X-Custom': 'value',
    })
  })
})
