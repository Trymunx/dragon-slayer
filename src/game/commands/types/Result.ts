// Types -----------------------------------------------------------------------
// The Result type models a computation that might fail while providing some
// meaningful error data. To achieve this, the type is a union between the Ok
// type that can hold some generic data of type A and the Err type that holds
// some generic data of type E (notice that the two generics are intentionally
// separate from one another).
export type Result<E, A>
  = Ok<A>
  | Err<E>

// The Ok type is a simple wrapper around data returned from a successful
// computation. It can store any generic type A. The readonly property `_kind`
// can be used to  distinguish between Ok and Err as we don't have real pattern
// matching in javascript.
export interface Ok<A> {
  readonly _kind: 'Ok',
  value: A
}

// A simple helper function to create an Ok object.
export const ok = (value: any): Ok<any> => ({
  _kind: 'Ok',
  value
})

// The Err type is a simple wrapper around data returned from an unsuccessful
// computation. This is far more expressive than returning undefined/null as
// we can begin to encode some information about *why* the computation failed.
// Our command parsing is a great use-case for this, as a parse could fail for
// many different reasons. Our game can now receive some more contextual 
// information to display to the user, for example.
export interface Err<E> {
  readonly _kind: 'Err',
  value: E
}

// A simple helper function to create an Orr object.
export const err = (value: any): Err<any> => ({
  _kind: 'Err',
  value
})

// Functions -------------------------------------------------------------------
// This is just a quick type alias that cuts down on a lot of the noise in the
// following function type signatures.
type R = Result<any, any>

// The following two functions, isOk and isErr, can be used in place of 
// traditional pattern matching. We can have some Result type and check whether
// it holds an Ok value or an Error.
export const isOk = (result: R): boolean => result._kind === 'Ok'
export const isErr = (result: R): boolean => result._kind === 'Err'

// Unbox a Result. If the given Result was Ok then we'll take that value, if not
// then use the default value supplied. This effectively ignores any Err values.
export const withDefault = (result: R, defaultValue: any): any =>
  isOk(result) ? result.value : defaultValue

// Transform the value stored inside a Result, only if it is Ok.
export const map = (result: R, fn: (a: any) => any) =>
  isOk(result) ? ok(fn(result.value)) : result

// Transform the value stored inside a Result, only if it is an Err.
export const mapErr = (result: R, fn: (a: any) => any) =>
  isErr(result) ? err(fn(result.value)) : result