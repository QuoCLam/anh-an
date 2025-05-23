const BASE_URL = import.meta.env.VITE_API_URL;

export async function fetchNotifications() {
    const res = await fetch(`${BASE_URL}/notifications/`);
    if (!res.ok) throw new Error(`Không thể tải thông báo (status: ${res.status})`);
    return res.json();
}
