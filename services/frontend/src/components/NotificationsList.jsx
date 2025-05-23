import React, { useEffect, useState } from "react";
import { fetchNotifications } from "../api/notifications";

export default function NotificationsList() {
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchNotifications()
            .then(setNotifications)
            .catch(err => setError(err.message));
    }, []);

    if (error) return <div style={{color:"red"}}>Error: {error}</div>;
    if (notifications.length === 0) return <div>Chưa có thông báo.</div>;

    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Order ID</th>
                    <th>Message</th>
                    <th>Created At</th>
                </tr>
            </thead>
            <tbody>
                {notifications.map(n => (
                    <tr key={n.id}>
                        <td>{n.id}</td>
                        <td>{n.order_id}</td>
                        <td>{n.message}</td>
                        <td>{n.created_at}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
