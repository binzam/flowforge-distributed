import { io } from "socket.io-client";
import { baseURL } from "./api-client";

const socket = io(baseURL, {
  withCredentials: true,
  autoConnect: false,
});

export default socket;
