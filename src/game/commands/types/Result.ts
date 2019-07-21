export interface Ok<A> {
  readonly _kind: 'Ok',
  value: A
}

export const ok = (value: any): Ok<any> => ({
  _kind: 'Ok',
  value
})

export interface Err<E> {
  readonly _kind: 'Err',
  value: E
}

export const err = (value: any): Err<any> => ({
  _kind: 'Err',
  value
})

export type Result<E, A>
  = Ok<A>
  | Err<E>

export const isOk = (result: Result<any, any>): boolean => 
  result._kind === 'Ok'
  
export const isErr = (result: Result<any, any>): boolean => 
  result._kind === 'Err'
