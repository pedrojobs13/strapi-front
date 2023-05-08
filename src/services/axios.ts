import axios, { AxiosError } from "axios";
import { parseCookies } from "nookies";
import Router from "next/router";

export function getAPICliente(ctx?: any) {
  const { "nextauth.token": jwt } = parseCookies(ctx);

  const api = axios.create({
    baseURL: "http://localhost:1337/api",
  });

  if (jwt) {
    api.defaults.headers["Authorization"] = `Bearer ${jwt}`;
  }

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      if (error.response?.status === 401 || error.response?.status === 500) {
        console.log("Está aqui");
      }
      return Promise.reject(error);
    }
  );

  return api;
}
