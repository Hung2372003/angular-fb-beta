import { File } from "../../common/file.interface"

export interface Message {
    id:number
    createdBy:number
    content:string
    createdTime:string
    fileCode:number
    listFile:Array<File>
}
