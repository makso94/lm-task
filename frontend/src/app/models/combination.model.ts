// Summary data returned from list endpoint
export interface CombinationSummary {
  id: number;
  title: string;
  side: number;
  visible_count: number;
  created_at: string;
  updated_at: string;
}

// Full combination data with matrix and positions
export interface Combination extends CombinationSummary {
  matrix: number[][];
  visible_positions: [number, number][];
  not_visible_positions: [number, number][];
}

export interface CreateCombinationRequest {
  title: string;
  side: number;
  matrix: number[][];
}

export interface CombinationResponse {
  message: string;
  data: Combination;
}

export interface CombinationsListResponse extends Array<CombinationSummary> {}

export type SortOrder = 'asc' | 'desc' | '';

export type SortableColumn = 'id' | 'title' | 'side' | 'visible_count' | 'created_at' | 'updated_at';

export interface CombinationQueryParams {
  sort_by?: SortableColumn;
  sort_order?: SortOrder;
  filter?: string;
}
