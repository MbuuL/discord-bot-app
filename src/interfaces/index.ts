export interface Success {
  status: number,
  message: string,
  data?: (JSON | Array<any>)
}

export interface Error {
  status: number,
  message: string,
  errors?: Array<any>,
  error?: (string | JSON)
}

export interface gitlabResponse {
  user_name: string,
  user_avatar: string,
  project: {
    namespace: string,
    web_url: string,
    [key: string]: any
  },
  event_name: string,
  commits: Array<any>,
  [key: string]: any,
}