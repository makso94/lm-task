import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CombinationDialogComponent } from '../combination-dialog/combination-dialog.component';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';
import { MatrixViewerDialogComponent } from '../matrix-viewer-dialog/matrix-viewer-dialog.component';
import { CombinationList } from '../combination-list/combination-list';
import { ApiService } from '../../services/api-service';
import { Combination, CombinationSummary, CreateCombinationRequest, SortableColumn, SortOrder } from '../../models/combination.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    CombinationList,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  title = 'LM Application';
  combinations: CombinationSummary[] = [];
  loading = false;
  initialSortBy: SortableColumn = 'created_at';
  initialSortOrder: SortOrder = 'desc';

  // Current filter and sort state
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

    // Build params
    const params: any = {};

    // Add sort params if set
    if (this.currentSortOrder) {
      params.sort_by = this.currentSortBy;
      params.sort_order = this.currentSortOrder;
    }

    // Add filter if set
    if (this.currentFilter) {
      params.filter = this.currentFilter;
    }

    this.apiService.getCombinations(params).subscribe({
      next: (response: CombinationSummary[]) => {
        this.combinations = response;
        this.loading = false;
      },
      error: () => {
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
    this.currentFilter = filter.trim();
    this.loadCombinations();
  }

  onEdit(combination: CombinationSummary): void {
    // Need full data with matrix
    this.loading = true;
    this.apiService.getCombination(combination.id).subscribe({
      next: (fullCombination: Combination) => {
        this.loading = false;
        const dialogRef = this.dialog.open(CombinationDialogComponent, {
          width: '800px',
          disableClose: false,
          data: fullCombination
        });

        dialogRef.afterClosed().subscribe((result: any) => {
          if (result && result.id) {
            this.apiService.updateCombination(result.id, {
              title: result.title,
              side: result.side,
              matrix: result.matrix
            }).subscribe({
              next: () => {
                this.loadCombinations();
              },
              error: () => {
              }
            });
          }
        });
      },
      error: (error) => {
        this.loading = false;
      }
    });
  }

  onDelete(combination: CombinationSummary): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '400px',
      data: { title: combination.title }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.deleteCombination(combination.id).subscribe({
          next: () => {
            this.loadCombinations();
          },
          error: () => {
          }
        });
      }
    });
  }

  onAddCombination(): void {
    const dialogRef = this.dialog.open(CombinationDialogComponent, {
      width: '800px',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe((result: CreateCombinationRequest | undefined) => {
      if (result) {
        this.apiService.createCombination(result).subscribe({
          next: () => {
            this.loadCombinations();
          },
          error: () => {
          },
        });
      }
    });
  }

  onRowClick(combination: CombinationSummary): void {
    this.loading = true;
    this.apiService.getCombination(combination.id).subscribe({
      next: (fullCombination: Combination) => {
        this.loading = false;
        this.dialog.open(MatrixViewerDialogComponent, {
          width: '800px',
          maxWidth: '90vw',
          data: fullCombination
        });
      },
      error: (error) => {
        this.loading = false;
      }
    });
  }
}
