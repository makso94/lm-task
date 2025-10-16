<?php

namespace App\Http\Controllers;

use App\Models\Combination;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CombinationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $combinations = Combination::latest()->get();
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
