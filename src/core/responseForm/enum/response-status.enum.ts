export class ResultResponseStatus {
  static SUCCESS = new ResultResponseStatus(
    true,
    'Request was successful',
    200,
  );
  static FAILURE = new ResultResponseStatus(false, 'Request failed', 400);

  constructor(
    public readonly isSuccess: boolean,
    public readonly message: string,
    public readonly code: number,
  ) {}

  getMessage() {
    return this.message;
  }

  getCode() {
    return this.code;
  }
}
