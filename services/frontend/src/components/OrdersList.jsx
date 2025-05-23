import React, { useEffect, useState } from "react";
import { fetchOrders } from "../api/orders";

export default function OrdersList() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchOrders()
            .then(setOrders)
            .catch(err => setError(err.message));
    }, []);

    if (error) return <div style={{color:"red"}}>Error: {error}</div>;
    if (orders.length === 0) return <div>Chưa có đơn hàng.</div>;

    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Khách hàng</th>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Ngày tạo</th>
                </tr>
            </thead>
            <tbody>
                {orders.map(order => (
                    <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.customer}</td>
                        <td>{order.product}</td>
                        <td>{order.quantity}</td>
                        <td>{order.created_at}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
