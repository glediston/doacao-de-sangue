

export const mockRequest = (body = {}, params = {}, query = {}, extra = {}) =>
  ({
    body,
    params,
    query,
    ...extra,
  } as any);
  