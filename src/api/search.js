/**
 * Search API utility functions
 */

const SEARCH_API_BASE_URL = 'https://localhost:777/search';

/**
 * Performs a search query against the API
 * @param {string} query - The search query string
 * @param {Object} options - Additional options for the request
 * @returns {Promise<Array>} - Promise that resolves to an array of search results
 */
export const performSearch = async (query, options = {}) => {    
  const {
    timeout = 5000,
    signal = null,
    isGetAll = false
  } = options;

  if (!isGetAll) {
    if (!query || query.trim() === '' || query.trim().length < 3) {
      return [];
    }
  }
  else {
    query = '""'; // Broad query to fetch all results
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    // Use the provided signal or the timeout controller's signal
    const requestSignal = signal || controller.signal;

    const url = new URL(SEARCH_API_BASE_URL);
    url.searchParams.set('query', query.trim());

    const response = await fetch(url.toString(), {
      signal: requestSignal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Search API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Ensure we always return an array
    return Array.isArray(data) ? data : [];
    
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Search request timed out');
    }
    
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Unable to connect to search service. Please check if the server is running on localhost:777');
    }
    
    throw error;
  }
};

/**
 * Creates a debounced version of the search function
 * @param {Function} searchFn - The search function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced search function
 */
export const createDebouncedSearch = (searchFn, delay = 300) => {
  let timeoutId;
  
  return (...args) => {
    clearTimeout(timeoutId);
    return new Promise((resolve, reject) => {
      timeoutId = setTimeout(async () => {
        try {
          const result = await searchFn(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };
};
