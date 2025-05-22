import { getToken } from "../util/getToken";

export async function getUserProfile() {
  const token = getToken();
  if (!token) return;
  const res = await fetch(`${apiUrl}/users/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.ok) {
    const data = await res.json();
    return data;
  } else {
    console.error(await res.text());
    return null;
  }
}

export async function updateUserProfile(activity, profile_image) {
  const token = getToken();
  if (!token) return;
  const res = await fetch(`${apiUrl}/users/profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ activity, profile_image }),
  });
  if (res.ok) {
    const data = await res.json();
    return data;
  } else {
    console.error(await res.text());
    return null;
  }
}

export async function setUserIsFilled() {
  const token = getToken();
  if (!token) return;
  const res = await fetch(`${apiUrl}/users/set_is_filled`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.ok) {
    const data = await res.json();
    return data;
  } else {
    console.error(await res.text());
    return null;
  }
}
