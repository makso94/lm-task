<?php

namespace App\Http\Controllers;

use App\Models\Combination;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CombinationController extends Controller
{
    /**
     * Count visible positions from each side of the matrix
     */
    private function countVisible(array $matrix): array
    {


        $n = count($matrix);
        $visible = [];

        // Helper function to mark visible positions
        $markVisible = function ($i, $j) use (&$visible) {
            $visible["$i,$j"] = true;
        };

        // --- From Left ---
        for ($i = 0; $i < $n; $i++) {
            $maxSeen = -1;
            for ($j = 0; $j < $n; $j++) {
                $val = $matrix[$i][$j];
                if ($val === 0) {
                    continue;
                }
                if ($val >= $maxSeen) {
                    $markVisible($i, $j);
                    $maxSeen = $val;
                }
            }
        }

        // --- From Right ---
        for ($i = 0; $i < $n; $i++) {
            $maxSeen = -1;
            for ($j = $n - 1; $j >= 0; $j--) {
                $val = $matrix[$i][$j];
                if ($val === 0) {
                    continue;
                }
                if ($val >= $maxSeen) {
                    $markVisible($i, $j);
                    $maxSeen = $val;
                }
            }
        }

        // --- From Top ---
        for ($j = 0; $j < $n; $j++) {
            $maxSeen = -1;
            for ($i = 0; $i < $n; $i++) {
                $val = $matrix[$i][$j];
                if ($val === 0) {
                    continue;
                }
                if ($val >= $maxSeen) {
                    $markVisible($i, $j);
                    $maxSeen = $val;
                }
            }
        }

        // --- From Bottom ---
        for ($j = 0; $j < $n; $j++) {
            $maxSeen = -1;
            for ($i = $n - 1; $i >= 0; $i--) {
                $val = $matrix[$i][$j];
                if ($val === 0) {
                    continue;
                }
                if ($val >= $maxSeen) {
                    $markVisible($i, $j);
                    $maxSeen = $val;
                }
            }
        }

        // Convert visible keys back to [row, col] pairs
        $visiblePositions = [];
        foreach (array_keys($visible) as $key) {
            [$i, $j] = array_map('intval', explode(',', $key));
            $visiblePositions[] = [$i, $j];
        }

        // Calculate not visible positions
        $notVisiblePositions = [];
        for ($i = 0; $i < $n; $i++) {
            for ($j = 0; $j < $n; $j++) {
                // Skip positions with 0 value and visible positions
                if ($matrix[$i][$j] !== 0 && !isset($visible["$i,$j"])) {
                    $notVisiblePositions[] = [$i, $j];
                }
            }
        }

        return [
            'count' => count($visible),
            'visible_positions' => $visiblePositions,
            'not_visible_positions' => $notVisiblePositions
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Combination::query();

        // Get sort parameters
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');

        // Validate sort column
        $allowedSortColumns = ['id', 'title', 'side', 'created_at', 'updated_at'];
        if (!in_array($sortBy, $allowedSortColumns)) {
            $sortBy = 'created_at';
        }

        // Validate sort order
        $sortOrder = strtolower($sortOrder) === 'asc' ? 'asc' : 'desc';

        // Apply sorting
        $combinations = $query->orderBy($sortBy, $sortOrder)->get();

        return response()->json($combinations);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|min:3|max:32',
            'side' => 'required|integer|min:1|max:50',
            'matrix' => 'required|array',
            'matrix.*' => 'array',
            'matrix.*.*' => 'numeric|min:0|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();

        // Validate matrix dimensions
        $side = $validated['side'];
        $matrix = $validated['matrix'];

        if (count($matrix) !== $side) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => [
                    'matrix' => ["Matrix must have exactly {$side} rows"]
                ]
            ], 422);
        }

        foreach ($matrix as $rowIndex => $row) {
            if (count($row) !== $side) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => [
                        'matrix' => ["Row " . ($rowIndex + 1) . " must have exactly {$side} columns"]
                    ]
                ], 422);
            }
        }

        // Convert matrix values to integers
        $matrix = array_map(function ($row) {
            return array_map('intval', $row);
        }, $matrix);

        // Update the validated matrix with converted values
        $validated['matrix'] = $matrix;

        // Calculate visible positions
        $visibleData = $this->countVisible($matrix);

        // Add calculated fields to validated data
        $validated['visible_count'] = $visibleData['count'];
        $validated['visible_positions'] = $visibleData['visible_positions'];
        $validated['not_visible_positions'] = $visibleData['not_visible_positions'];

        $combination = Combination::create($validated);

        return response()->json([
            'message' => 'Combination created successfully',
            'data' => $combination
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $combination = Combination::findOrFail($id);
        return response()->json($combination);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
