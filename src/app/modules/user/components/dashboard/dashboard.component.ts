import { ChangeDetectionStrategy, Component, inject, model, NgModule, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatListModule} from '@angular/material/list';
import {CommonModule, DatePipe, NgIf} from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatTreeModule} from '@angular/material/tree';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface DialogData {
  name: string;
  description: string;
  endDate: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatListModule,
    DatePipe,
    MatTreeModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  readonly name = signal('');
  readonly description = signal('');
  readonly endDate = signal('');
  readonly dialog = inject(MatDialog);
  readonly taskModel = inject(MatDialog);

  tasks: any = []
  finishedTasks: any = []
  isHideFinishedTasks = false;
  taskForm! : FormGroup;

  hideSingleSelectionIndicator = signal(false);

  constructor(private userService: UserService,
    private fb: FormBuilder
  ){
    this.getTasks(false, 'updatedDate', true);
    this.getFinishedTasks();
  }

  getTasks(isComplete:any, sortBy:any, isDecs:any){
    this.userService.getTask(isComplete, sortBy, isDecs).subscribe((res) =>{
      this.tasks = res
    })
  }
  
  getFinishedTasks(){
    this.userService.getTask(true, 'updatedDate', true).subscribe((res) =>{
      this.finishedTasks = res
    })
  }
  
  showFinishedTasks(){
    if(this.isHideFinishedTasks == true){
      this.isHideFinishedTasks = false;
    } else {
      this.isHideFinishedTasks = true;
    }
  }

  toggleSingleSelectionIndicator() {
    this.hideSingleSelectionIndicator.update(value => !value);
  }

  onChangeComplete($event){
    const id = $event.target.value;
    const isChecked = $event.target.checked;
    this.userService.postFinishTask(id).subscribe(res => {
      if(res && res.isCompleted == isChecked){
        this.getTasks(false, 'createdDate', true);
        this.getFinishedTasks();
      }
    })
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(TaskCreatingModel, {
      data: {
        name: this.name(), 
        description: this.description(),
        endDate: this.endDate()
      },
      width: '500px',
      enterAnimationDuration,
      exitAnimationDuration,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getTasks(false, 'updatedDate', true);
      if (result !== undefined) {
        this.name.set(result);
        this.description.set(result);
        this.endDate.set(result);
      }
    });
  }

  openTaskModel(id:any) {
    this.userService.getTaskById(id).subscribe(res => {
      const dialogRef = this.taskModel.open(TaskModel, {
        data: res,
        width: '500px',
        enterAnimationDuration: '500ms',
        exitAnimationDuration: '300ms',
      });

      dialogRef.afterClosed().subscribe(result => {
        this.getTasks(false, 'updatedDate', true);
        if (result !== undefined) {
          this.name.set(result);
          this.description.set(result);
          this.endDate.set(result);
        }
      });
    })
  }
}

@Component({
  selector: 'dashboard-dialog',
  templateUrl: 'dashboard-dialog.component.html',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatDatepickerModule,
    CommonModule, 
    ReactiveFormsModule
  ],
  providers: [provideNativeDateAdapter()],
  styleUrl: './dashboard.component.scss'
})
export class TaskCreatingModel {
  readonly dialogRef = inject(MatDialogRef<TaskCreatingModel>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly name = model(this.data.name);
  readonly description = model(this.data.description);
  readonly endDate = model(this.data.endDate);

  taskForm! :FormGroup;
  listOfTasks:any = [];

  constructor(private userService: UserService,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
  ){
    this.taskForm = this.fb.group({
      name: [null, [Validators.required]],
      description: [null, [Validators.required]],
      endDate: [null, [Validators.required]]
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  postTask(): void {
    // console.log(this.taskForm.value);
    this.userService.postNewTask(this.taskForm.value).subscribe(res => {
      if(res && res.id){
        this.snackbar.open("Add a new task successfully", "Close", {duration: 5000, horizontalPosition: "left"});
      } else {
        this.snackbar.open("Add a new task failed", "Close", {duration: 5000, panelClass:"error-snackbar", horizontalPosition: "left"});
      }
    })
    this.dialogRef.close();
  }
}

@Component({
  selector: 'taskModel.component',
  templateUrl: 'taskModel.component.html',
  standalone: true,
  imports: [
    MatDialogTitle, 
    MatDialogContent, 
    MatDialogActions, 
    MatDialogClose, 
    MatButtonModule,
    MatCardModule,
    DatePipe,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule, 
    ReactiveFormsModule,
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './dashboard.component.scss'
})
export class TaskModel {
  readonly data = inject(MAT_DIALOG_DATA);
  taskForm! :FormGroup;
  
  readonly dialogRef = inject(MatDialogRef<TaskModel>);
  readonly name = model(this.data.name);
  readonly description = model(this.data.description);
  readonly endDate = model(this.data.endDate);

  constructor(private userService: UserService,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
  ){
    this.taskForm = this.fb.group({
      name: [null, [Validators.required]],
      description: [null, [Validators.required]],
      endDate: [null, [Validators.required]]
    })
  }

  putTask(id:any): void {
    // console.log(this.taskForm.value);
    this.userService.putEditTask(id,this.taskForm.value).subscribe(res => {
      if(res && res.id){
        this.snackbar.open("Update task successfully", "Close", {duration: 5000, horizontalPosition: "left"});
      } else {
        this.snackbar.open("Update task failed", "Close", {duration: 5000, panelClass:"error-snackbar", horizontalPosition: "left"});
      }
    })
    this.dialogRef.close();
  }

}
