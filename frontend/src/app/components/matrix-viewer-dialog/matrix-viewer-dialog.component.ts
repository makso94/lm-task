import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Combination } from '../../models/combination.model';

@Component({
  selector: 'app-matrix-viewer-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './matrix-viewer-dialog.component.html',
  styleUrls: ['./matrix-viewer-dialog.component.scss']
})
export class MatrixViewerDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<MatrixViewerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Combination
  ) {}

  isVisible(row: number, col: number): boolean {
    return this.data.visible_positions.some(pos => pos[0] === row && pos[1] === col);
  }

  isNotVisible(row: number, col: number): boolean {
    return this.data.not_visible_positions.some(pos => pos[0] === row && pos[1] === col);
  }

  get emptyPositions(): [number, number][] {
    const positions: [number, number][] = [];
    for (let row = 0; row < this.data.matrix.length; row++) {
      for (let col = 0; col < this.data.matrix[row].length; col++) {
        if (this.data.matrix[row][col] === 0) {
          positions.push([row, col]);
        }
      }
    }
    return positions;
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
