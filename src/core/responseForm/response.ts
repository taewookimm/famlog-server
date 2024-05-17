import { ResultResponseStatus } from './enum/response-status.enum';

export class ResultResponse<T> {
  private isSuccess: boolean;
  private message: string;
  private code: number;
  private resultObject?: T;
  private resultList?: T[];
  private totalMap?: Record<string, any>;

  // 요청에 성공한 경우
  constructor(
    resultObject?: T,
    resultList?: T[],
    totalMap?: Record<string, any>,
  ) {
    this.isSuccess = true;
    this.message = 'Request was successful';
    this.code = 200;
    this.resultObject = resultObject;
    this.resultList = resultList;
    this.totalMap = totalMap;
  }

  // 요청에 실패한 경우
  static failure(status: ResultResponseStatus): ResultResponse<null> {
    const instance = new ResultResponse<null>();
    instance.isSuccess = status.isSuccess;
    instance.message = status.getMessage();
    instance.code = status.getCode();
    instance.resultObject = null;
    return instance;
  }
}
