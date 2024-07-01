const SERVER_URL =
  import.meta.env.VITE_ENV == "production"
    ? import.meta.env.VITE_PROD_SERVER_URL
    : import.meta.env.VITE_SERVER_DEV_URL;

console.log(SERVER_URL);

export { SERVER_URL };
