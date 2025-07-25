import { toast } from "react-toastify";

const apiCall = async (endpoint, options = {}) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
    credentials: "include",
    ...options,
  };

  if (options.body instanceof FormData) {
    delete config.headers["Content-Type"];
  } else if (options.body && typeof options.body === "object") {
    config.body = JSON.stringify(options.body);
  }

  const res = await fetch(`${endpoint}`, config);
  const data = await res.json();
  if (data.success == false) {
    toast.error(data.message);
  }

  return data;
};

export default apiCall;
