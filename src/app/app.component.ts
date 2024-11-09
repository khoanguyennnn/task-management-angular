import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';

import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StorageService } from './auth/services/storage/storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule, 
    RouterOutlet, 
    RouterLink,
    FormsModule,
    HttpClientModule,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  // title = 'task-management-angular';
  isUserLoggedIn:boolean = StorageService.isUserLoggedIn();

  constructor(private router: Router) {}

  ngOnInit(){
    this.router.events.subscribe(e => {
      this.isUserLoggedIn = StorageService.isUserLoggedIn()
    })
  }

  logout(){
    StorageService.logout();
    this.router.navigateByUrl("/login");
  }
}