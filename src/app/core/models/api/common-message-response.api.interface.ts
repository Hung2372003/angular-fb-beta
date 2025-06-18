export interface MessageResponse<T> {
  id:number,
  error:boolean,
  title:string,
  object:T,
}
