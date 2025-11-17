// src/utils/apiResponse.ts
import { Response } from 'express';
import httpStatus from 'http-status-codes';

interface IApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

const sendResponse = <T>(
  res: Response,
  data: Omit<IApiResponse<T>, 'success'>,
  statusCode: number = httpStatus.OK
): void => {
  res.status(statusCode).json({
    success: true,
    ...data,
  });
};

export default sendResponse;