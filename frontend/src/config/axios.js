import axios from "axios";

// In production, REACT_APP_BASE_URL should be empty or not set
// This makes API calls relative to the same origin
// In development (Docker), it should be http://localhost:8000
export const axiosi = axios.create({
  withCredentials: true,
  baseURL: process.env.REACT_APP_BASE_URL
    ? `${process.env.REACT_APP_BASE_URL}/api/v1`
    : "/api/v1", // Default to relative path for production
});
