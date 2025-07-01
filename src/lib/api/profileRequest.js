import { getToken } from "../util/getToken";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;


export async function getUserProfile() {
  const token = await getToken();
  console.log("實際取得的 token:", token); // <== 看這個是什麼
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


export async function updateUserProfile(userProfile) {
  const token = await getToken();
  if (!token) return;

  const res = await fetch(`${apiUrl}/users/profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userProfile),
  });

  if (res.ok) {
    const data = await res.json();
    return data;
  } else {
    console.error("❌ updateUserProfile error:", await res.text());
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

// check is fill
export async function isUserProfileFilled() {
  const token = await getToken();
  if (!token) return;
  const res = await fetch(`${apiUrl}/users/check_is_filled`, {
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
