import axios from "axios";
import { API_URL } from "./constants";

const instance = axios.create({
baseURL: API_URL,
  timeout: 6000, //6s
});

export default instance;
