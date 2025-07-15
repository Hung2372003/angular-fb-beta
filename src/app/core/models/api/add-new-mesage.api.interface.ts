export interface AddNewMessageRequest {
  groupChatId: number;
  content?: string;
  files?: Array<{ file: File; url: string }>;
}
