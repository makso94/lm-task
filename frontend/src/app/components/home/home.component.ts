import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { CombinationDialogComponent } from '../combination-dialog/combination-dialog.component';
import { ApiService } from '../../services/api-service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  title = 'LM Application';

  constructor(private dialog: MatDialog, private apiService: ApiService) {}

  onAddCombination() {
    const dialogRef = this.dialog.open(CombinationDialogComponent, {
      width: '600px',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Combination data:', result);
        this.apiService.create('combinations', result).subscribe({
          next: (response) => {
            console.log('Combination created successfully:', response);
          },
          error: (error) => {
            console.error('Error creating combination:', error);
          },
        });
      }
    });
  }
}
