import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { error } from 'console';
import { StorageService } from '../../services/storage/storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    RouterOutlet,
    ReactiveFormsModule,
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm! : FormGroup;
  hidePassword = true;

  isUserLoggedIn:boolean = StorageService.isUserLoggedIn();

  constructor (private fb:FormBuilder,
    private authService : AuthService,
    private snackbar: MatSnackBar,
    private router: Router
  ){
    this.loginForm = this.fb.group({
      username:[null,[Validators.required]],
      password:[null,[Validators.required]],
    })
    if(this.isUserLoggedIn){
      this.router.navigateByUrl("/user/dashboard");
    }
  }

  ngOnInit(){
    this.router.events.subscribe(e => {
      this.isUserLoggedIn = StorageService.isUserLoggedIn()
    })
  }

  togglePasswordVisibility(){
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(){
    this.authService.login(this.loginForm.value).subscribe((res) => {
      if(res.userName){
        const user = {
          username: res.userName,
          email: res.email,
        }
        StorageService.saveUser(user);
        StorageService.saveToken(res.token);
        this.snackbar.open("Login successfully", "Close", {duration: 5000, horizontalPosition: "left"});
        this.router.navigateByUrl("/user/dashboard");
      } else {
        this.snackbar.open("Login failed", "Close", {duration: 5000, panelClass: "error-snackbar", horizontalPosition: "left"});  
      }
    }, error => {  
      this.snackbar.open(error.message, "Close", {duration: 5000, panelClass: "error-snackbar", horizontalPosition: "left"});
    })
  }
}
