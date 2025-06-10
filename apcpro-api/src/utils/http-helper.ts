import { HttpResponse } from "../models/http-response-model";
import { User } from "../models/user-model";

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data,
});

export const created = (data: any): HttpResponse => ({
  statusCode: 201,
  body: data,
});

export const noContent = (): HttpResponse => ({
  statusCode: 204,
  body: null,
});

export const notFound = (message = "Não encontrado"): HttpResponse => ({
  statusCode: 404,
  body: { message },
});

export const badRequest = (message = "Requisição inválida"): HttpResponse => ({
  statusCode: 400,
  body: { message },
});

export const internalError = (
  message = "Erro interno do servidor",
  error?: any
): HttpResponse => ({
  statusCode: 500,
  body: { message, error },
});
