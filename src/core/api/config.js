// FastAPI backend — must match uvicorn port (default 8000)
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api/v1";

export const API_KEY =
  process.env.REACT_APP_API_KEY || "hotel-app-dev-xk9m2p7q1n4v8w3a6c5d";

if (process.env.NODE_ENV === "development") {
  console.info("[API] Using backend:", API_BASE_URL);
}
