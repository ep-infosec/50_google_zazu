import { AuthService } from './../auth/auth.service';
import { GhostService } from './../shared/services/ghost.service';
import { Component, OnInit, OnDestroy, Inject, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatStepper } from '@angular/material';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  minimized = false;
  constructor(
    private router: Router,
    private ghostService: GhostService,
    public dialog: MatDialog,
    private authService: AuthService,
    private cdRef: ChangeDetectorRef,
    private http: HttpClient,
  ) {}
  ghostSubscription: Subscription;
  ghostStatus: boolean;
  companyName;

  async ngOnInit() {
    this.ghostSubscription = this.ghostService.ghostStatusObservable.subscribe(status => {
      this.ghostStatus = status;
      this.cdRef.detectChanges();
    });
    this.ghostService.getStatus();
    const call = await <any> this.http.get('../../assets/main-variables.json').toPromise();
    this.companyName = call.companyName;
  }
  /*
  ngAfterViewChecked(): void {
    // Called after every check of the component's view. Applies to components only.
    if (this.ghostStatus) {
      this.cdRef.detectChanges();
    }
    if (!this.ghostStatus) {
      this.cdRef.detectChanges();
    }

  }
  */

  toggleMenu() {
    this.minimized = !this.minimized;
  }

  ngOnDestroy() {
    this.ghostSubscription.unsubscribe();
  }

  logout(stepper: MatStepper) {
    const dialogRef = this.dialog.open(LogoutConfirmation, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.logout();
      }
    });
  }
}

@Component({
  selector: 'logout-confirmation',
  templateUrl: 'logout-confirmation.html'
})
export class LogoutConfirmation {
  constructor(public dialogRef: MatDialogRef<LogoutConfirmation>, @Inject(MAT_DIALOG_DATA) public data) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
