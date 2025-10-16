export interface Combination {
  id: number;
  title: string;
  side: number;
  matrix: number[][];
  created_at: string;
  updated_at: string;
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

export interface CombinationsListResponse extends Array<Combination> {}

export type SortOrder = 'asc' | 'desc';

export type SortableColumn = 'id' | 'title' | 'side' | 'created_at' | 'updated_at';

export interface CombinationQueryParams {
  sort_by?: SortableColumn;
  sort_order?: SortOrder;
}
