import { getToken } from "@/lib/util/getToken";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export async function uploadDiaryToServer(date, diary, mood) {
  const token = await getToken();
  if (!token) return;
  const res = await fetch(`${apiUrl}/users/log`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ date, diary, mood }),
  });
  return res;
}

export async function fetchDiaryFromServer() {
  const token = await getToken();
  if (!token) return;
  const res = await fetch(`${apiUrl}/users/log`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.ok) {
    const data = await res.json();
    return data.logs;
  } else {
    console.error(res.status);
    console.error(await res.text());
    return null;
  }
}
