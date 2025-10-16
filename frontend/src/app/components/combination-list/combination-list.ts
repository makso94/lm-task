import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { Combination } from '../../models';

@Component({
  selector: 'app-combination-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './combination-list.html',
  styleUrl: './combination-list.scss'
})
export class CombinationList {
  @Input() combinations: Combination[] = [];
  @Input() loading = false;

  displayedColumns: string[] = ['id', 'title', 'side', 'created_at'];
}
