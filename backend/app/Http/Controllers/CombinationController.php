<?php

namespace App\Http\Controllers;

use App\Models\Combination;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CombinationController extends Controller
{
    private function validateAndProcessCombination(Request $request): array
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|min:3|max:32',
            'side' => 'required|integer|min:1|max:50',
            'matrix' => 'required|array',
            'matrix.*' => 'array',
            'matrix.*.*' => 'numeric|min:0|max:1000',
        ]);

        if ($validator->fails()) {
            abort(422, json_encode([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ]));
        }

        $validated = $validator->validated();

        // Check matrix is the right size
        $side = $validated['side'];
        $matrix = $validated['matrix'];

        if (count($matrix) !== $side) {
            abort(422, json_encode([
                'message' => 'Validation failed',
                'errors' => [
                    'matrix' => ["Matrix must have exactly {$side} rows"]
                ]
            ]));
        }

        foreach ($matrix as $rowIndex => $row) {
            if (count($row) !== $side) {
                abort(422, json_encode([
                    'message' => 'Validation failed',
                    'errors' => [
                        'matrix' => ["Row " . ($rowIndex + 1) . " must have exactly {$side} columns"]
                    ]
                ]));
            }
        }

        // Cast to ints
        $matrix = array_map(function ($row) {
            return array_map('intval', $row);
        }, $matrix);

        // Update matrix with converted values
        $validated['matrix'] = $matrix;

        // Calculate visibility
        $visibleData = $this->countVisible($matrix);

        // Add calculated fields
        $validated['visible_count'] = $visibleData['count'];
        $validated['visible_positions'] = $visibleData['visible_positions'];
        $validated['not_visible_positions'] = $visibleData['not_visible_positions'];

        return $validated;
    }

    private function countVisible(array $matrix): array
    {


        $n = count($matrix);
        $visible = [];

        // Track which cells are visible
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
                if ($val > $maxSeen) {
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
                if ($val > $maxSeen) {
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
                if ($val > $maxSeen) {
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
                if ($val > $maxSeen) {
                    $markVisible($i, $j);
                    $maxSeen = $val;
                }
            }
        }

        // Convert to array of positions
        $visiblePositions = [];
        foreach (array_keys($visible) as $key) {
            [$i, $j] = array_map('intval', explode(',', $key));
            $visiblePositions[] = [$i, $j];
        }

        // Find non-visible positions
        $notVisiblePositions = [];
        for ($i = 0; $i < $n; $i++) {
            for ($j = 0; $j < $n; $j++) {
                // Skip zeros and already visible cells
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

    public function index(Request $request)
    {
        $query = Combination::query();

        // Filter by title if provided
        $filter = $request->input('filter');
        if ($filter) {
            $query->where('title', 'like', '%' . $filter . '%');
        }

        // Sorting
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');

        // Validate sort column
        $allowedSortColumns = ['id', 'title', 'side', 'visible_count', 'created_at', 'updated_at'];
        if (!in_array($sortBy, $allowedSortColumns)) {
            $sortBy = 'created_at';
        }

        // Validate sort order
        $sortOrder = strtolower($sortOrder) === 'asc' ? 'asc' : 'desc';

        // Get results with only needed columns
        $combinations = $query
            ->select('id', 'title', 'side', 'visible_count', 'created_at', 'updated_at')
            ->orderBy($sortBy, $sortOrder)
            ->get();

        return response()->json($combinations);
    }

    public function store(Request $request)
    {
        $validated = $this->validateAndProcessCombination($request);
        $combination = Combination::create($validated);

        return response()->json([
            'message' => 'Combination created successfully',
            'data' => $combination
        ], 201);
    }

    public function show(string $id)
    {
        $combination = Combination::findOrFail($id);
        return response()->json($combination);
    }

    public function update(Request $request, string $id)
    {
        $combination = Combination::findOrFail($id);
        $validated = $this->validateAndProcessCombination($request);
        $combination->update($validated);

        return response()->json([
            'message' => 'Combination updated successfully',
            'data' => $combination
        ], 200);
    }

    public function destroy(string $id)
    {
        $combination = Combination::findOrFail($id);
        $combination->delete();

        return response()->json([
            'message' => 'Combination deleted successfully'
        ], 200);
    }
}
