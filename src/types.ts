/**********/
/** Misc **/
/**********/
export const enum Error {
  // More info on https://www.loggly.com/blog/http-status-code-diagram to know where to put an error

  // 404
  // The server can't find the requested resource
  NotFound = 'La ressource est introuvable',
  RouteNotFound = 'La route est introuvable',

  // 500
  // The server encountered an unexpected condition that prevented it from fulfilling the request
  InternalServerError = 'Erreur inconnue',
}
