export async function parseApiResponse(response) {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(body.error?.message ?? "La richiesta non e riuscita.");
    error.code = body.error?.code;
    error.status = response.status;
    throw error;
  }
  return body.data;
}

export function createApi(hooks = {}) {
  return async function api(path, options = {}) {
    const response = await fetch(path, options);
    if (response.status === 401 && hooks.onUnauthorized) {
      hooks.onUnauthorized();
      throw new Error("Sessione scaduta. Accedi nuovamente.");
    }
    return parseApiResponse(response);
  };
}

export const api = createApi();
