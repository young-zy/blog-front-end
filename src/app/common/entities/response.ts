export interface Response{
  code: number;
  message: string;
}

export interface TokenResponse extends Response {
  token: string;
  expire: string;
}
