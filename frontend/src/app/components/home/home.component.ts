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

  // Track current filter and sort state for API requests
  private currentFilter = '';
  private currentSortBy: SortableColumn = 'created_at';
  private currentSortOrder: SortOrder = 'desc';

  constructor(private dialog: MatDialog, private apiService: ApiService) {}

  ngOnInit(): void {
    this.currentSortBy = this.initialSortBy;
    this.currentSortOrder = this.initialSortOrder;
    this.loadCombinations();
  }

  loadCombinations(): void {
    this.loading = true;

    // Build query params
    const params: any = {};

    // Only include sort params if sortOrder is not empty
    if (this.currentSortOrder) {
      params.sort_by = this.currentSortBy;
      params.sort_order = this.currentSortOrder;
    }

    // Only include filter param if not empty
    if (this.currentFilter) {
      params.filter = this.currentFilter;
    }

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
    this.currentSortBy = event.column;
    this.currentSortOrder = event.direction;
    this.loadCombinations();
  }

  onFilterChange(filter: string): void {
    // Trim whitespace and update filter
    this.currentFilter = filter.trim();
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
