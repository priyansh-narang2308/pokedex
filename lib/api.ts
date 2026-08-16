const BASE_URL = "https://pokeapi.co/api/v2";

export async function fetchApi<T>(endpoint: string): Promise<T> {
  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Pokemon not found");
    }
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}
