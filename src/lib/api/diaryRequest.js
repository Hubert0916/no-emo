import { getToken } from "@/lib/util/getToken";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export async function saveDiary(date, mood, description) {
  const token = await getToken();
  const res = await fetch(`${apiUrl}/users/mood`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ date, mood }),
  });
  return res;
}

export async function getDiary() {
    const token = await getToken();
    const res = await fetch(`${apiUrl}/users/mood`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, 
        },
    });
    const data = await res.json();
    return data.logs;
}