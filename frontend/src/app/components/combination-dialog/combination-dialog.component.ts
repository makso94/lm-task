import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Combination } from '../../models/combination.model';

@Component({
  selector: 'app-combination-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './combination-dialog.component.html',
  styleUrls: ['./combination-dialog.component.scss']
})
export class CombinationDialogComponent implements OnInit {
  combinationForm: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CombinationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Combination | null
  ) {
    this.isEditMode = !!data;

    // Convert matrix to string for editing
    const matrixString = data?.matrix
      ? data.matrix.map(row => row.join(' ')).join('\n')
      : '';

    this.combinationForm = this.fb.group({
      title: [data?.title || '', [Validators.required, Validators.minLength(3), Validators.maxLength(32)]],
      side: [data?.side || '', [Validators.required, Validators.min(1), Validators.max(50)]],
      matrix: [matrixString, [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Revalidate matrix when side changes
    this.combinationForm.get('side')?.valueChanges.subscribe(() => {
      this.combinationForm.get('matrix')?.updateValueAndValidity();
    });

    // Custom matrix validation
    this.combinationForm.get('matrix')?.setValidators([
      Validators.required,
      this.matrixValidator.bind(this)
    ]);
  }

  matrixValidator(control: AbstractControl): ValidationErrors | null {
    const matrixValue = control.value;
    const sideValue = this.combinationForm?.get('side')?.value;

    if (!matrixValue || !sideValue) {
      return null;
    }

    const side = parseInt(sideValue);
    if (isNaN(side) || side < 1 || side > 50) {
      return null;
    }

    const rows = matrixValue.trim().split('\n').filter((row: string) => row.trim() !== '');

    if (rows.length !== side) {
      return {
        matrixRows: {
          expected: side,
          actual: rows.length,
          message: `Matrix must have exactly ${side} rows (found ${rows.length})`
        }
      };
    }

    for (let i = 0; i < rows.length; i++) {
      const values = rows[i].trim().split(/\s+/);
      if (values.length !== side) {
        return {
          matrixCols: {
            row: i + 1,
            expected: side,
            actual: values.length,
            message: `Row ${i + 1} must have exactly ${side} values (found ${values.length})`
          }
        };
      }

      for (let j = 0; j < values.length; j++) {
        const num = parseFloat(values[j]);
        if (isNaN(num)) {
          return {
            matrixValue: {
              row: i + 1,
              col: j + 1,
              value: values[j],
              message: `Row ${i + 1}, Column ${j + 1}: "${values[j]}" is not a valid number`
            }
          };
        }
        if (num < 0 || num > 1000) {
          return {
            matrixRange: {
              row: i + 1,
              col: j + 1,
              value: num,
              message: `Row ${i + 1}, Column ${j + 1}: value ${num} must be between 0 and 1000`
            }
          };
        }
      }
    }

    return null;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.combinationForm.valid) {
      const formData = this.combinationForm.value;

      // Parse matrix string
      const matrixRows: string[] = formData.matrix.trim().split('\n').filter((row: string) => row.trim() !== '');
      const side: number = parseInt(formData.side);

      const result: any = {
        title: formData.title,
        side: side,
        matrix: matrixRows.map((row: string) => row.trim().split(/\s+/))
      };

      if (this.isEditMode && this.data) {
        result.id = this.data.id;
      }

      this.dialogRef.close(result);
    }
  }

  getTitleError(): string {
    const titleControl = this.combinationForm.get('title');
    if (titleControl?.hasError('required')) {
      return 'Title is required';
    }
    if (titleControl?.hasError('minlength')) {
      return 'Title must be at least 3 characters';
    }
    if (titleControl?.hasError('maxlength')) {
      return 'Title must not exceed 32 characters';
    }
    return '';
  }

  getSideError(): string {
    const sideControl = this.combinationForm.get('side');
    if (sideControl?.hasError('required')) {
      return 'Side number is required';
    }
    if (sideControl?.hasError('min')) {
      return 'Side must be at least 1';
    }
    if (sideControl?.hasError('max')) {
      return 'Side must not exceed 50';
    }
    return '';
  }

  getMatrixError(): string {
    const matrixControl = this.combinationForm.get('matrix');
    if (matrixControl?.hasError('required')) {
      return 'Matrix data is required';
    }
    if (matrixControl?.hasError('matrixRows')) {
      return matrixControl.errors?.['matrixRows'].message;
    }
    if (matrixControl?.hasError('matrixCols')) {
      return matrixControl.errors?.['matrixCols'].message;
    }
    if (matrixControl?.hasError('matrixValue')) {
      return matrixControl.errors?.['matrixValue'].message;
    }
    if (matrixControl?.hasError('matrixRange')) {
      return matrixControl.errors?.['matrixRange'].message;
    }
    return '';
  }
}
