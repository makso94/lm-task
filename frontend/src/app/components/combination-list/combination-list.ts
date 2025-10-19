import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { debounceTime, map, distinctUntilChanged } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Combination, SortableColumn, SortOrder } from '../../models/combination.model';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-combination-list',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
  ],
  templateUrl: './combination-list.html',
  styleUrl: './combination-list.scss',
})
export class CombinationList implements OnInit, OnChanges, AfterViewInit {
  @Input() combinations: Combination[] = [];
  @Input() loading = false;
  @Input() initialSortBy: SortableColumn = 'created_at';
  @Input() initialSortOrder: SortOrder = 'desc';
  @Output() sortChange = new EventEmitter<{ column: SortableColumn; direction: SortOrder }>();
  @Output() filterChange = new EventEmitter<string>();
  @Output() edit = new EventEmitter<Combination>();
  @Output() delete = new EventEmitter<Combination>();
  @Output() rowClick = new EventEmitter<Combination>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = ['title', 'side', 'visible_count', 'created_at', 'updated_at', 'actions'];
  filteredCombinations: Combination[] = [];
  paginatedCombinations: Combination[] = [];
  filterControl = new FormControl('');

  // Internal state for current sort
  currentSortBy: SortableColumn = 'created_at';
  currentSortOrder: SortOrder = 'desc';

  ngOnInit() {
    // Set initial sort state from inputs
    this.currentSortBy = this.initialSortBy;
    this.currentSortOrder = this.initialSortOrder;

    // Subscribe to filter changes with debounce and distinctUntilChanged
    this.filterControl.valueChanges
      .pipe(
        debounceTime(300),
        map((value: string | null) => (value || '').trim()),
        distinctUntilChanged()
      )
      .subscribe((filterValue: string) => {
        this.filterChange.emit(filterValue);
        if (this.paginator) {
          this.paginator.firstPage();
        }
      });
  }

  ngAfterViewInit() {
    if (this.sort) {
      // Listen to sort changes and emit to parent
      this.sort.sortChange.subscribe(() => {
        // Update internal state - direction can be 'asc', 'desc', or '' (empty for no sort)
        this.currentSortBy = this.sort.active as SortableColumn;
        this.currentSortOrder = this.sort.direction as SortOrder;

        // Emit to parent with both column and direction
        this.sortChange.emit({
          column: this.currentSortBy,
          direction: this.currentSortOrder
        });
      });
    }

    if (this.paginator) {
      // Listen to paginator changes
      this.paginator.page.subscribe(() => {
        this.updatePaginatedData();
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['combinations']) {
      // Since filtering is now done on backend, just use combinations directly
      this.filteredCombinations = [...this.combinations];
      this.updatePaginatedData();
    }
  }


  private updatePaginatedData() {
    if (!this.paginator) {
      this.paginatedCombinations = this.filteredCombinations;
      return;
    }

    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;
    this.paginatedCombinations = this.filteredCombinations.slice(startIndex, endIndex);
  }

  onEdit(combination: Combination): void {
    this.edit.emit(combination);
  }

  onDelete(combination: Combination): void {
    this.delete.emit(combination);
  }

  onRowClick(combination: Combination): void {
    this.rowClick.emit(combination);
  }
}
