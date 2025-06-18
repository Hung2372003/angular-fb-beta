import {  Component, OnInit } from '@angular/core';
import {  FormControl, FormGroup, Validators, ReactiveFormsModule  } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AlertService } from '../../../core/services/alert.service';
import { ErrorInputRegister, InputField, LoginFormData, RegisterFormData } from '../../../core/models/layout/auth/auth-form-data.interface';
import { passwordMatchValidator } from '../../../shared/validators/password-match.validator';
import { CommonModule } from '@angular/common';
import { CallApiService } from '../../../core/services/call-api.service';
import { MessageResponse } from '../../../core/models/api/common-message-response.api.interface';
import { SentenceCasePipe } from '../../../shared/pipe/sentence-case.pipe';

@Component({
  selector: 'app-login',
  imports: [MatDatepickerModule,
            MatNativeDateModule,
            ReactiveFormsModule,
            CommonModule,
            SentenceCasePipe
          ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})

export class LoginComponent implements OnInit {

  constructor(
    private alert: AlertService,
    private ApiService:CallApiService
  ) {}
  showPassword: boolean = false;
  showRepeatPassword: boolean = false;
  toggleFormLogin: boolean = false;
  touchedFields: { [key: string]: boolean } = {};
  authRegisterForm!: FormGroup <RegisterFormData>;
  authLoginForm!: FormGroup <LoginFormData>;
  errorForm: ErrorInputRegister = {
    errorName: false,
    errorEmail: false,
    errorUsername: false,
    errorPassword: false,
    errorRepeatPassword: false
  };
  inputLoginField : Array<InputField> = [
    { fieldName:'username',fieldIcon:'fa-regular fa-user-tie', type:'text'},
    { fieldName:'password',fieldIcon:'fa-regular fa-lock-keyhole', type:'password'}
  ]
  inputRegisterField : Array<InputField> = [
    { fieldName: 'email', fieldIcon: 'fa-regular fa-square-envelope', type: 'email'},
    ...this.inputLoginField,
    { fieldName: 'repeatPassword', fieldIcon: 'fa-regular fa-arrows-repeat', type: 'password'}
  ]

  ngOnInit(): void {
    this.authLoginForm =  new FormGroup<LoginFormData>({
      username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      password: new FormControl('', { nonNullable: true, validators: [Validators.required] })
    });

    this.authRegisterForm =  new FormGroup<RegisterFormData>({
      username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      repeatPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
      name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      birthday: new FormControl('', { nonNullable: true, validators: [Validators.required] })
    },{validators: passwordMatchValidator});
    this.authRegisterForm.get('password')?.valueChanges.subscribe(() => {
      this.authRegisterForm.updateValueAndValidity();
    });

    this.authRegisterForm.get('repeatPassword')?.valueChanges.subscribe(() => {
      this.authRegisterForm.updateValueAndValidity();
    });
  }
  toggleForm() {
    this.clearAllErrors(this.authLoginForm)
    this.clearAllErrors(this.authRegisterForm)
    this.showPassword = false;
    this.showRepeatPassword = false;
    this.authRegisterForm.reset();
    this.authLoginForm.reset();
    this.toggleFormLogin = !this.toggleFormLogin;
  }
  onFieldClick(field: string) {
    this.touchedFields[field] = true;
  }
  isFieldInvalid(field: string, formGroup: FormGroup): boolean {
    const control = formGroup.get(field);
    return !!(control && control.invalid && (control.touched));
  }
  onFieldTouchOrClick(field: string,authForm:FormGroup) {
    const control = authForm.get(field);
    if (control && !control.touched) {
      control.markAsTouched();
    }

    this.touchedFields[field] = true;
  }
  clearAllErrors(form: FormGroup) {
    Object.keys(form.controls).forEach(field => {
      const control = form.get(field);
      control?.setErrors(null);         // Xóa lỗi thủ công
      control?.markAsPristine();        // Đánh dấu là chưa chỉnh sửa
      control?.markAsUntouched();       // Đánh dấu là chưa chạm
    });
  }

  async onSubmitRegister(){
    if (this.authRegisterForm.invalid) {
        this.markFormGroupTouched(this.authRegisterForm);
        this.alert.show('Please enter complete information!', 'warning', 3000, Date.now());
        return;
    }

    let message:MessageResponse<object> = await this.ApiService.callApi('Security/Register','post',this.authRegisterForm.value)
    console.log(message);
    this.alert.show(message.title,message.error == true ? 'error':'success',3000,Date.now())

  }
  async onSubmitLogin(){
      if (this.authLoginForm.invalid) {
        this.markFormGroupTouched(this.authLoginForm);
        this.alert.show('Please enter complete information!', 'warning', 3000, Date.now());
        return;
    }
    let message:MessageResponse<object> = await this.ApiService.callApi('Security/UserLogin','post',this.authLoginForm.value)
    console.log(message);
    this.alert.show(message.title,message.error == true ? 'error':'success',3000,Date.now())

  }
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }
}
