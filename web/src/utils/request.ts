export async function fetch(url: string, options: any) {
  const token = localStorage.getItem("token");
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };
  try {
    const response = await window.fetch(url, { ...options, headers });
    if (response.status >= 200 && response.status < 300) {
      const data = await response.text();
      if (data === "" || data === null) {
        return null;
      }
      return JSON.parse(data);
    }

    if (response.status === 204) {
      return null;
    }

    // 如果是401，跳转到登录页
    if (response.status === 401) {
      window.location.href = "/login";
    }

    if (response.status === 400) {
      // 读取body内容
      const data = await response.json();
      throw new Error(data);
    } else if (response.status === 404) {
      const data = await response.json();
      throw new Error(data);
    } else if (response.status === 500) {
      const data = await response.json();
      throw new Error(data);
    }

    const error = new Error();
    throw error;
  } catch (error: any) {
    throw error;
  }
}

export async function fetchRaw(url: string, data: any) {
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  try {
    const response = await window.fetch(url, {
      headers,
      method: "POST",
      body: JSON.stringify(data),
    });

    if (response.ok === false) {
      const reader = await response.text();
      throw new Error(reader);
    }

    const reader = response.body!.getReader();
    return {
      [Symbol.asyncIterator]() {
        return {
          async next() {
            const { done, value } = await reader.read();
            if (done) {
              return { done: true, value: null };
            }
            return {
              done: false,
              value: new TextDecoder("utf-8").decode(value),
            };
          },
        };
      },
    };
  } catch (error: any) {
    throw error;
  }
}

export const get = (url: string, options?: any) => {
  return fetch(url, {
    method: "GET",
    ...options,
  });
};

export const post = (url: string, options?: any) => {
  return fetch(url, {
    method: "POST",
    ...options,
  });
};

export const postJson = (url: string, data: any) => {
  return post(url, {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const put = (url: string, options?: any) => {
  return fetch(url, {
    method: "PUT",
    ...options,
  });
};

export const putJson = (url: string, data: any) => {
  return put(url, {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const del = (url: string, options?: any) => {
  return fetch(url, {
    method: "DELETE",
    ...options,
  });
};