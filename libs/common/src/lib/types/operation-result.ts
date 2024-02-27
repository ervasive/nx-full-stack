export type OperationResult<
  D = undefined,
  E extends Record<string, string[]> = Record<string, string[]>
> =
  | { status: 'init'; data?: undefined; errors?: undefined }
  | { status: 'resolved'; data: D; errors?: undefined }
  | { status: 'failed'; data?: undefined; errors: E };
