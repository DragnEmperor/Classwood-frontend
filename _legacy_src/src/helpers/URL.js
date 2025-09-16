const LOCAL_API_URL = "http://127.0.0.1:8000/api/";
const HOSTED_API_URL = "https://pandu420.pythonanywhere.com/api/";
const DEFAULT_API_URL = process.env.NODE_ENV === "development" ? LOCAL_API_URL : HOSTED_API_URL;

const withTrailingSlash = (url) => (url.endsWith("/") ? url : `${url}/`);

export const API_URL = withTrailingSlash(process.env.REACT_APP_API_URL || DEFAULT_API_URL);
export const API_BASE_URL = API_URL.replace(/\/api\/?$/, "/");
export const buildMediaUrl = (path = "") => {
  if (!path) {
    return "";
  }

  try {
    return new URL(path, API_BASE_URL).href;
  } catch {
    return `${API_BASE_URL}${path}`;
  }
};
