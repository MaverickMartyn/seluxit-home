import Vue, { PluginObject } from "vue";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

// full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const config: AxiosRequestConfig = {
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};

const _axios: AxiosInstance = axios.create(config);

_axios.interceptors.request.use(
  (cfg) => {
    // do something before request is sent
    return cfg;
  },
  (err) => {
    // do something with request error
    return Promise.reject(err);
  },
);

// add a response interceptor
_axios.interceptors.response.use(
  (res) => {
    // do something with response data
    return res;
  },
  (err) => {
    // do something with response error
    return Promise.reject(err);
  },
);

const Plugin: PluginObject<any> = {
  install: (Vue) => {
    Vue.$axios = _axios;
  },
};
Plugin.install = (Vue) => {
  Vue.$axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    $axios: {
      get(): AxiosInstance {
        return _axios;
      },
    },
  });
};

Vue.use(Plugin);

export default Plugin;
