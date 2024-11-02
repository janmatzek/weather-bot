export type GetDataParams = {
  url: string;
  headers?: Record<string, string>;
  params?: Record<string, any>;
};

export type Place = {
  name: string;
  displayName: string;
  latitude: number;
  longitude: number;
  error?: string;
};
