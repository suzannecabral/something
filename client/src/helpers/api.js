import axios from "axios";
const HOST = process.env.HOST || "0.0.0.0";
const PORT = process.env.PORT || 8000;

/**
 * development client
 * @param {string} host
 * @returns axios instance
 */
const httpClient = (host) =>
  axios.create({
    baseURL: `http://${host || HOST}:${PORT}`,
    timeout: 1000,
    headers: { "X-Custom-Header": "420" },
  });

/**
 * production client
 * @param {string} host
 * @returns axios instance
 */
const httpsClient = (host) =>
  axios.create({
    baseURL: `https://${host || HOST}:${PORT}`,
    timeout: 1000,
    headers: { "X-Custom-Header": "420" },
  });

/**
 * create an axios instance pre-configured to the API
 * @returns httpClient or httpsClient
 */
const apiClient = async () => {
  if (process.env.NODE_ENV === 'production') {
    // don't include the baseURL if we're serving React from Express
    return axios.create({
      timeout: 1000,
      headers: { "X-Custom-Header": "420"}
    })
  }
  const hostname = window.location.host.split(":")[0];
  let client;
  switch (window.location.protocol) {
    case "http:":
      client = httpClient(hostname);
      break;
    case "https:":
      client = httpsClient(hostname);
      break;
    default:
      client = axios.create({
        headers: { "X-Custom-Header": "future 420"}
      });
      break;
  }
  return client;
};

/**
 * GET a list of products from the API
 * @returns {array} [{name, description},]
 */
export const getProducts = async () => {
  const cli = await apiClient(); // determine which client to use
  const result = await cli.get('/products'); // get the products
  return result?.data || []
};

/**
 * GET a list of products from the API
 * @param {string} format
 * @returns {array} [ {name, description,...},]
 */
 export const getProductsInFormat = async (format) => {
  const cli = await apiClient(); // determine which client to use
  const result = await cli.get(`/products/${format}`); // get the products
  return result?.data || []
};

export const submitNewProduct = async (product) => {
  const cli = await apiClient();
  const result = await cli.post('/products', product);
  return result;
}

export default httpClient;
