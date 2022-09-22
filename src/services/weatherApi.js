import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const weatherApiHeaders = {
  'X-RapidAPI-Key': 'c46ff3ae35msh2d8ea35e9dc14b8p1bee04jsnf980dfc18795',
  'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com',
};
const createRequest = (url) => ({ url, headers: weatherApiHeaders });

export const weatherApi = createApi({
  reducerPath: 'weatherApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://weatherapi-com.p.rapidapi.com',
  }),
  endpoints: (builder) => ({
    getSearch: builder.query({
      query: (searchTerm) => createRequest(`/search.json?q=${searchTerm}`),
    }),

    getWeather: builder.query({
      query: (searchTerm) => createRequest(`/current.json?q=${searchTerm}`),
    }),

    getForecast: builder.query({
      query: (searchTerm) =>
        createRequest(`/forecast.json?q=${searchTerm}&days=3`),
    }),

    getTime: builder.query({
      query: (searchTerm) => createRequest(`/timezone.json?q=${searchTerm}`),
    }),
  }),
});

export const {
  useLazyGetSearchQuery,
  useGetWeatherQuery,
  useGetForecastQuery,
  useGetTimeQuery,
  useLazyGetWeatherQuery,
  useLazyGetForecastQuery,
  useLazyGetTimeQuery,
} = weatherApi;
