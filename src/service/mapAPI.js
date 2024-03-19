import { createApi,fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const api = 'https://nominatim.openstreetmap.org/reverse';
export const mapsApi = createApi({
  reducerPath: 'mapsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: api,
  }),
  tagTypes: ['mapsData'],
  endpoints: builder => ({
    searchGeoCodingByLatLong: builder.query({
      query: args => {
        const {lat, long} = args;
        return {
          url: `?lat=${lat}&lon=${long}&format=json&zoom=18&addressdetails=1&accept-language=en`,
          method: 'GET',
        };
      },
      providesTags: ['mapsData'],
    }),
  }),
});
export const {
  useSearchGeoCodingByLatLongQuery,
  useLazySearchGeoCodingByLatLongQuery,
} = mapsApi;