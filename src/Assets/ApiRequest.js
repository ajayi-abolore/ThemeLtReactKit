
const getApiBaseUrl = () => {
  return (
    window.LT_CONFIG?.baseUrl ||
    import.meta.env.VITE_API_BASE_URL ||
    '/backend'
  ).replace(/\/+$/, '');
};

export async function apiGet(endpoint) {
  const baseUrl = getApiBaseUrl();

  const path = endpoint.startsWith('/')
    ? endpoint
    : `/${endpoint}`;

  const token = window.LT_CONFIG?.token;

  const headers = {
    Accept: 'application/json'
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${baseUrl}${path}`,
    {
      method: 'GET',
      headers
    }
  );

  if (!response.ok) {
    throw new Error(
      `HTTP error: ${response.status}`
    );
  }

  const result = await response.json();

  if (String(result.responseCategory) !== '200') {
    throw new Error(
      result.responseResult ||
      'LifeTechOCMS API request failed'
    );
  }

  return result;
}
