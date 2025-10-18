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
  initialSortBy: SortableColumn = 'created_at';
  initialSortOrder: SortOrder = 'desc';

  constructor(private dialog: MatDialog, private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadCombinations(this.initialSortBy, this.initialSortOrder);
  }

  loadCombinations(sortBy: SortableColumn, sortOrder: SortOrder): void {
    this.loading = true;

    // Only include sort params if sortOrder is not empty
    const params = sortOrder
      ? { sort_by: sortBy, sort_order: sortOrder }
      : {};

    this.apiService.getCombinations(params).subscribe({
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

  onSortChange(event: { column: SortableColumn; direction: SortOrder }): void {
    this.loadCombinations(event.column, event.direction);
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
            this.loadCombinations(this.initialSortBy, this.initialSortOrder); // Reload the list
          },
          error: (error) => {
            console.error('Error creating combination:', error);
          },
        });
      }
    });
  }
}
