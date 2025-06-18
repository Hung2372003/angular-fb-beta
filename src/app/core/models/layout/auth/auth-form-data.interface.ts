import { FormControl, Validators } from "@angular/forms";

export interface LoginFormData{
  username: FormControl<string>;
  password: FormControl<string>;
}
export interface RegisterFormData extends LoginFormData {
  repeatPassword: FormControl<string>;
  email: FormControl<string>;
  name: FormControl<string>;
  birthday: FormControl<string>;
}
export interface ErrorInputLogin{
  errorUsername:boolean,
  errorPassword:boolean,
}
export interface ErrorInputRegister extends ErrorInputLogin{
  errorRepeatPassword:boolean,
  errorEmail:boolean,
  errorName:boolean,
}
export interface InputField {
      fieldName:string,
      fieldIcon:string,
      type:string,
}
