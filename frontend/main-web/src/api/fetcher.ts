import { bidApi, mainApi } from ".";

export const mainApiFetcher = async <T>(url: string): Promise<T> => {
  const { data } = await mainApi.get(url);

  return data;
};

export const bidApiFetcher = async <T>(url: string): Promise<T> => {
  const { data } = await bidApi.get(url);

  return data;
};
