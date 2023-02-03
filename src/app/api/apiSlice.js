import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials } from "../../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

console.log("BaseQuery", baseQuery);

const baseQueryWithReauth = async (args, api, extraOptions) => {
  console.log("Args in baseQueryWithReauth", args); //Req url, body
  console.log("API in baseQueryWithReauth ", api);
  // console.log(extraOptions)

  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 403) {
    console.log("Sending Refresh Token");

    const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);

    if (refreshResult?.data) {
      // Store the new token
      api.dispatch(setCredentials({ ...refreshResult.data }));

      result = await baseQuery(args, api, extraOptions);
    } else {
      // The refresh token has expired
      if (refreshResult?.error.status === 403) {
        refreshResult.error.data.message = "Your login has expired. ";
      }
      return refreshResult;
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Note", "User"],
  endpoints: (builder) => ({}),
});
