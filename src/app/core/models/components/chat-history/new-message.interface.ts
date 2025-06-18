import { File } from "../../common/file.interface";
import { User } from "../../common/user.interface";
export interface NewMessage {
  groupChatId: number
  groupAvatar?: string
  groupName:string
  listUser:Array<User>
  status:boolean
  newMessage:{
    id:number
    content:string
    createdBy:number
    createdTime:string
  }
}


