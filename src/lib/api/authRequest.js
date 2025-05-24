const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export async function register({ email, name, password }) {
  const res = await fetch(`${apiUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name, password }),
  });
  return res;
}

export const login = async () => {
  const data = {
    email: 'test@example.com',
    password: '123456',
  };

  return fetch('https://httpbin.org/post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // 必要
    },
    body: JSON.stringify(data),
  });
};

/*
export async function login({ email, password }) {
  const res = await fetch(`${apiUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res;
}
*/