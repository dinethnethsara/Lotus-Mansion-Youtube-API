/**
 * HTTP utilities for making requests
 */
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * Default user agent to use for requests
 */
const DEFAULT_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

/**
 * Default headers to use for requests
 */
const DEFAULT_HEADERS = {
  'User-Agent': DEFAULT_USER_AGENT,
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
};

/**
 * Makes a GET request to the specified URL
 * @param url URL to request
 * @param options Request options
 * @returns Promise with the response
 */
export const get = async <T = any>(
  url: string,
  options: AxiosRequestConfig = {}
): Promise<AxiosResponse<T>> => {
  const config: AxiosRequestConfig = {
    ...options,
    headers: {
      ...DEFAULT_HEADERS,
      ...options.headers,
    },
    method: 'GET',
  };

  return axios(url, config);
};

/**
 * Makes a POST request to the specified URL
 * @param url URL to request
 * @param data Data to send
 * @param options Request options
 * @returns Promise with the response
 */
export const post = async <T = any>(
  url: string,
  data: any,
  options: AxiosRequestConfig = {}
): Promise<AxiosResponse<T>> => {
  const config: AxiosRequestConfig = {
    ...options,
    headers: {
      ...DEFAULT_HEADERS,
      ...options.headers,
    },
    method: 'POST',
    data,
  };

  return axios(url, config);
};

/**
 * Downloads a file from the specified URL
 * @param url URL to download from
 * @param options Request options
 * @returns Promise with the response
 */
export const downloadFile = async (
  url: string,
  options: AxiosRequestConfig = {}
): Promise<Buffer> => {
  const config: AxiosRequestConfig = {
    ...options,
    headers: {
      ...DEFAULT_HEADERS,
      ...options.headers,
    },
    responseType: 'arraybuffer',
  };

  const response = await axios.get(url, config);
  return Buffer.from(response.data);
};
