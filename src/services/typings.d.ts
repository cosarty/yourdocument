// @ts-ignore
/* eslint-disable */


type API_TYPE<T> = {
  message: string,
  code: number,
  data: T | null
}

declare namespace API {
  type Login = API_TYPE<{
    token: string
  }>
}


declare namespace Payload {
  type Login = {
    eamil: string,
    password: string
  }
}
