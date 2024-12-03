import axios from "axios";

interface Dictionary<T = any> {
  [key: string]: T;
}
export interface Request extends Dictionary {}

export interface Response extends Dictionary {}

export const post = <
  Req extends Request = Request,
  Res extends Response = Response,
>(
  url: string,
  params: Req,
): Promise<Res> => {
  return new Promise((resolve, reject) => {
    axios
      .post(url, params, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        const { data } = res;
        if (data.code === -1) {
          console.error({ type: "error", message: "服务器出错，请重试！" });
          reject(new Error(data.msg));
        } else {
          resolve(data);
        }
      })
      .catch((error) => {
        console.error({ type: "error", message: "网络异常，请重试！" });
        reject(error);
      });
  });
};

export const get = <
  Req extends Request = Request,
  Res extends Response = Response,
>(
  url: string,
  params?: Req,
): Promise<Res> => {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        const { data } = res;
        if (data.code === -1) {
          console.error({ type: "error", message: "服务器出错，请重试！" });
          reject(new Error(data.msg));
        } else {
          resolve(data.data);
        }
      })
      .catch((error) => {
        console.error({ type: "error", message: "网络异常，请重试！" });
        reject(error);
      });
  });
};
