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
import { StorageService } from '../../services/storage/storage.service';



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

  isUserLoggedIn:boolean = StorageService.isUserLoggedIn();

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
    this.authService.signup(this.signupForm.value).subscribe((res) => {
      if(res.userName != null){
        this.snackbar.open("Signup successfully", "Close", {duration: 5000, horizontalPosition: "left"});
        this.router.navigateByUrl("/login");
      } else {
        this.snackbar.open("Signup failed", "Close", {duration: 5000, panelClass:"error-snackbar", horizontalPosition: "left"});  
      }
    }, (error) => {
      this.snackbar.open(error.error.map(res => {return res.description}), "Close", {duration: 5000, panelClass: "error-snackbar", horizontalPosition: "left"});
    })
  }
}
