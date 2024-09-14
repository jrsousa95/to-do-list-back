import { Request, Response } from "express";
import logger from "node-color-log";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  PreconditionFailedError,
  UnauthorizedError,
  UploadError,
} from "./error-helper";

export type ErrorValue = {
  file?: string;
  function?: string;
  headers?: any;
  query?: any;
  params?: any;
  body?: any;
  files?: any;
  host?: any;
  route?: string;
};

export type ResponseJSON<T = any> = {
  statusCode: number;
  message: string;
  data?: T;
  error?: string;
};

/**
    O código de status de resposta 200 (OK) significa que a solicitação pode 
    ou não ser atendida eventualmente e pode ser proibida quando o processamento 
    ocorre. O servidor é um proxy de transformação (por exemplo, um acelerador 
    da Web) que recebeu 200 OK de sua origem, mas está retornando uma versão 
    modificada da resposta da origem.
    @param response Express response.
    @param message Mensagem de retorno.
    @param data Objeto com dados referente o que foi criado.
*/

function Ok(response: Response, message: string, data?: unknown) {
  const responseJSON: ResponseJSON = {
    statusCode: 200,
    message,
    data,
  };

  return response.status(responseJSON.statusCode).json(responseJSON);
}

/**
    Isso significa que o arquivo ou página que o navegador está solicitando não foi 
    encontrado pelo servidor, está ausente permanentemente ou apenas temporariamente.
    @param response Express response.
    @param message Mensagem de retorno.
    @param data Objeto com dados referente o que foi criado.
*/
function BadRequest(response: Response, message: string, data?: unknown) {
  const responseJSON: ResponseJSON = {
    statusCode: 400,
    error: "Bad Request",
    message,
    data,
  };

  return response.status(responseJSON.statusCode).json(responseJSON);
}

/**
    sso significa que o arquivo ou página que o navegador está solicitando não foi 
    encontrado pelo servidor. 404s não indicam se a página ou recurso ausente está 
    ausente permanentemente ou apenas temporariamente.
    @param response Express response.
    @param message Mensagem de retorno.
    @param data Objeto com dados referente o que foi criado.
*/
function NotFound(response: Response, message: string, data?: unknown) {
  const responseJSON: ResponseJSON = {
    statusCode: 404,
    error: "Not Found",
    message,
    data,
  };

  return response.status(responseJSON.statusCode).json(responseJSON);
}

/**
    O código de status de resposta 201 (Created) significa que a solicitação foi 
    atendida e resultou na criação de um novo recurso. O recurso recém-criado 
    pode ser referenciado pelo (s) URI (s) retornado (s) na entidade da resposta, 
    com o URI mais específico para o recurso fornecido por um campo de cabeçalho 
    Location.
    @param response Express response.
    @param message Mensagem de retorno.
    @param data Objeto com dados referente o que foi criado.
*/
function Created(response: Response, message: string, data?: unknown) {
  const responseJSON: ResponseJSON = {
    statusCode: 201,
    message,
    data,
  };

  return response.status(responseJSON.statusCode).json(responseJSON);
}

/**
    O status HTTP 204 (NoContent) indica que o servidor atendeu à solicitação 
    com êxito e que não há conteúdo a ser enviado no corpo da carga de resposta. 
    ... Por exemplo, você pode querer retornar o status 204 (Sem Conteúdo) em 
    operações UPDATE onde a carga útil do pedido é grande o suficiente para não 
    ser transportada para frente e para trás.
    @param response Express response.
*/
function NoContent(response: Response) {
  return response.status(204).send();
}

/**
    O código de status de resposta 412 (Precondition Failed) normalmente é usado 
    quando essas pré-condições falham. Seu exemplo parece uma solicitação inválida 
    (ou seja, o cliente enviou dados inválidos devido a valores ausentes).
    @param response Express response.
    @param message Mensagem de retorno.
*/
function PreconditionFailed(
  response: Response,
  message: string,
  data?: unknown
) {
  const errorResponseJSON: ResponseJSON = {
    statusCode: 412,
    error: "Precondition Failed",
    message,
    data,
  };

  return response.status(errorResponseJSON.statusCode).json(errorResponseJSON);
}

/**
    O código de status HTTP 500 é uma resposta de erro genérica. Isso significa que 
    o servidor encontrou uma condição inesperada que o impediu de atender à 
    solicitação. Esse erro geralmente é retornado pelo servidor quando nenhum outro 
    código de erro é adequado.
    @param response Express response.
*/
function ServerError(response: Response) {
  const errorResponseJSON: ResponseJSON = {
    statusCode: 500,
    error: "Internal Server Error",
    message: "Derrubaram o back.",
  };

  return response.status(errorResponseJSON.statusCode).json(errorResponseJSON);
}

/**
    O código de status de resposta 403 (Forbidden) significa que o servidor entendeu 
    a solicitação, mas se recusa a autorizá-la. Um servidor que deseja tornar 
    público o motivo da proibição da solicitação pode descrever esse motivo na carga 
    de resposta (se houver).
    @param response Express response.
    @param message Mensagem de retorno.
*/
function Forbidden(response: Response, message: string, data?: unknown) {
  const errorResponseJSON: ResponseJSON = {
    statusCode: 403,
    error: "Forbidden",
    message,
    data,
  };

  return response.status(errorResponseJSON.statusCode).json(errorResponseJSON);
}

/**
    A solicitação não foi aplicada porque não possui credenciais de autenticação 
    válidas para o recurso de destino. Se a solicitação incluiu credenciais de 
    autenticação, a resposta 401 indica que a autorização foi recusada para essas 
    credenciais.
    @param response Express response.
    @param message Mensagem de retorno.
    @param data Objeto com dados referente o que foi criado.
*/
function Unauthorized(response: Response, message: string, data?: unknown) {
  const errorResponseJSON: ResponseJSON = {
    statusCode: 401,
    error: "Unauthorized",
    message,
    data,
  };

  return response.status(errorResponseJSON.statusCode).json(errorResponseJSON);
}

function GetError(
  request: Request,
  response: Response,
  valueError: ErrorValue,
  error: any
) {
  if (error instanceof BadRequestError) {
    return BadRequest(response, error.message);
  }

  if (error instanceof ForbiddenError) {
    return Forbidden(response, error.message, { redirect: error.redirect });
  }

  if (error instanceof NotFoundError) {
    return NotFound(response, error.message);
  }

  if (error instanceof UnauthorizedError) {
    return Unauthorized(response, error.message);
  }

  if (error instanceof PreconditionFailedError) {
    return PreconditionFailed(response, error.message);
  }

  if (error instanceof UploadError) {
    return BadRequest(response, error.message);
  }

  if (error instanceof UnauthorizedError) {
    return Unauthorized(response, error.message);
  }

  logger.error({ ...valueError, id: request.ip }, error);

  return ServerError(response);
}

export default {
  Ok,
  BadRequest,
  Created,
  Forbidden,
  NoContent,
  NotFound,
  Unauthorized,
  ServerError,
  PreconditionFailed,
  GetError,
};
