import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { CombinationDialogComponent } from '../combination-dialog/combination-dialog.component';
import { CombinationList } from '../combination-list/combination-list';
import { ApiService } from '../../services/api-service';
import { Combination, CreateCombinationRequest, SortableColumn, SortOrder } from '../../models/combination.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    CombinationList,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  title = 'LM Application';
  combinations: Combination[] = [];
  loading = false;
  currentSortBy: SortableColumn = 'created_at';
  currentSortOrder: SortOrder = 'desc';

  constructor(private dialog: MatDialog, private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadCombinations();
  }

  loadCombinations(): void {
    this.loading = true;
    this.apiService.getCombinations({
      sort_by: this.currentSortBy,
      sort_order: this.currentSortOrder
    }).subscribe({
      next: (response: Combination[]) => {
        this.combinations = response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading combinations:', error);
        this.loading = false;
      },
    });
  }

  onSortChange(column: SortableColumn): void {
    if (this.currentSortBy === column) {
      // Toggle sort order if same column
      this.currentSortOrder = this.currentSortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      // New column, default to descending
      this.currentSortBy = column;
      this.currentSortOrder = 'desc';
    }
    this.loadCombinations();
  }

  onAddCombination(): void {
    const dialogRef = this.dialog.open(CombinationDialogComponent, {
      width: '600px',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe((result: CreateCombinationRequest | undefined) => {
      if (result) {
        console.log('Combination data:', result);
        this.apiService.createCombination(result).subscribe({
          next: (response) => {
            console.log('Combination created successfully:', response);
            this.loadCombinations(); // Reload the list
          },
          error: (error) => {
            console.error('Error creating combination:', error);
          },
        });
      }
    });
  }
}
