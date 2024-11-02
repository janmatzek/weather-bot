import axios from "axios";
import { GetDataParams } from "./types";

/**
 *
 * @param GetDataParams - object containing URL, headers and params
 * @returns Returns data object from the response.
 */
export async function requestDataViaAxiosGet({
  url,
  headers,
  params,
}: GetDataParams): Promise<Record<string, any>> {
  try {
    const response = await axios.get(url, {
      params,
      headers,
      timeout: 3 * 1000,
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.message);
      console.log(error.response?.data);
      throw new Error(error.message);
    } else {
      console.error(error);
      throw new Error("An error occurred while fetching data.");
    }
  }
}
