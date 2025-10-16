import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Combination, SortableColumn, SortOrder } from '../../models/combination.model';

@Component({
  selector: 'app-combination-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './combination-list.html',
  styleUrl: './combination-list.scss'
})
export class CombinationList {
  @Input() combinations: Combination[] = [];
  @Input() loading = false;
  @Input() currentSortBy: SortableColumn = 'created_at';
  @Input() currentSortOrder: SortOrder = 'desc';
  @Output() sortChange = new EventEmitter<SortableColumn>();

  displayedColumns: string[] = ['id', 'title', 'side', 'created_at'];

  onSort(column: SortableColumn): void {
    this.sortChange.emit(column);
  }

  getSortIcon(column: string): string {
    if (this.currentSortBy !== column) {
      return 'unfold_more';
    }
    return this.currentSortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward';
  }
}
