import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';  
import { Router, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-signup',
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
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signupForm! : FormGroup;
  hidePassword = true;

  constructor (private fb : FormBuilder,
    private authService : AuthService,
    private snackbar: MatSnackBar,
    private router: Router
  ){
    this.signupForm = this.fb.group({
      username:[null,[Validators.required]],
      email:[null,[Validators.required,Validators.email]],
      password:[null,[Validators.required]],
    })
  }

  togglePasswordVisibility(){
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(){
    this.authService.signup(this.signupForm.value).subscribe((res) => {
      console.log(res);
      if(res.userName != null){
        this.snackbar.open("Signup successfully", "Close", {duration: 5000, horizontalPosition: "left"});
        this.router.navigateByUrl("/login");
      } else {
        this.snackbar.open("Signup failed", "Close", {duration: 5000, panelClass:"error-snackbar", horizontalPosition: "left"});  
      }
    }, (error) => {
      console.log(error);
      this.snackbar.open(error.error, "Close", {duration: 5000, panelClass: "error-snackbar", horizontalPosition: "left"});
    })
  }
}
