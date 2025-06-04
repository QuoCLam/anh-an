import React, { useState, useEffect } from "react";
import { fetchOrders, createOrder, updateOrder, deleteOrder } from "../api/orders";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import StatusBadge from "../components/StatusBadge";

// Quy trình & label trạng thái
const STATUS_FLOW = [
  "pending", "approved", "purchasing", "producing", "qc", "packing", "shipping", "done", "cancelled"
];
const STATUS_LABELS = {
  pending: "Chờ duyệt",
  approved: "Đã duyệt",
  purchasing: "Mua vật tư",
  producing: "Sản xuất",
  qc: "Kiểm nghiệm",
  packing: "Đóng gói",
  shipping: "Giao hàng",
  done: "Hoàn thành",
  cancelled: "Đã huỷ",
};

// Kiểm tra nhắc nhở sắp đến hạn giao
function isWarning(order) {
  if (!order.delivery_date) return false;
  const today = new Date();
  const delivery = new Date(order.delivery_date);
  const daysLeft = Math.ceil((delivery - today) / (1000 * 60 * 60 * 24));
  return daysLeft <= 2 && daysLeft >= 0 && !["done", "cancelled"].includes(order.status);
}

export default function Orders() {
  // Đơn hàng lấy từ API
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    customer_name: "",
    product_name: "",
    quantity: "",
    note: "",
    unit: "sp",
    receive_date: "",
    delivery_date: ""
  });
  const [showDetail, setShowDetail] = useState(null);
  const [editOrder, setEditOrder] = useState(null);

  // Tìm kiếm/filter & phân trang
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;
  const [loading, setLoading] = useState(false);

  // Lấy đơn hàng từ API
  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line
  }, [search, statusFilter]);

  async function loadOrders() {
    setLoading(true);
    try {
      const data = await fetchOrders({ skip: 0, limit: 100, search });
      setOrders(data);
    } catch {
      alert("Không thể tải đơn hàng từ server");
    }
    setLoading(false);
  }

  // Thêm đơn mới (map đúng tên field mà backend cần!)
  async function handleAdd(e) {
    e.preventDefault();
    try {
      await createOrder({
        customer_name: form.customer_name,
        order_date: new Date().toISOString().slice(0, 10), // hoặc thêm input nếu cần chọn ngày
        items: [
          {
            product_name: form.product_name,
            quantity: Number(form.quantity),
            unit: form.unit || "sp" // mặc định là "sp"
          }
        ],
        note: form.note,
        receive_date: form.receive_date,
        delivery_date: form.delivery_date
      });
      setForm({
        customer_name: "",
        product_name: "",
        quantity: "",
        note: "",
        unit: "sp",
        receive_date: "",
        delivery_date: ""
      });
      loadOrders();
    } catch (err) {
      alert("Tạo đơn hàng thất bại: " + err.message);
    }
  }

  // Sửa đơn hàng
  async function handleEditSave(edited) {
    try {
      await updateOrder(edited.id, edited);
      setEditOrder(null);
      loadOrders();
    } catch (err) {
      alert("Cập nhật thất bại!");
    }
  }

  // Xóa đơn hàng
  async function handleDelete(id) {
    if (!window.confirm("Xoá đơn hàng này?")) return;
    try {
      await deleteOrder(id);
      if (showDetail && showDetail.id === id) setShowDetail(null);
      loadOrders();
    } catch (err) {
      alert("Xóa thất bại!");
    }
  }

  // Lọc, tìm kiếm, phân trang (frontend)
  const filteredOrders = orders
    .filter(o =>
      (!search ||
        o.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
        (o.items && o.items.some(i => i.product_name?.toLowerCase().includes(search.toLowerCase())))
      )
      && (!statusFilter || o.status === statusFilter)
    );
  const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE);
  const pageOrders = filteredOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Export PDF từng đơn
  function exportOrderPDF(order) {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`ĐƠN HÀNG: ${order.code || ""}`, 14, 16);
    doc.setFontSize(12);
    doc.text(`Khách hàng: ${order.customer_name}`, 14, 30);
    const items = order.items?.map(i => `${i.product_name} (${i.quantity} ${i.unit})`).join(", ") || "";
    doc.text(`Sản phẩm: ${items}`, 14, 40);
    doc.text(`Ngày nhận: ${order.receive_date}`, 14, 50);
    doc.text(`Ngày giao: ${order.delivery_date}`, 14, 60);
    doc.text(`Trạng thái: ${STATUS_LABELS[order.status] || ""}`, 14, 70);
    doc.text(`Ghi chú: ${order.note || "-"}`, 14, 80);
    doc.save(`order_${order.code || order.id}.pdf`);
  }

  // Export PDF tất cả đơn
  function exportAllOrdersPDF() {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("DANH SÁCH ĐƠN HÀNG", 14, 16);
    doc.setFontSize(10);

    const rows = filteredOrders.map((o, i) => [
      (page - 1) * PAGE_SIZE + i + 1,
      o.code,
      o.customer_name,
      o.items?.map(it => it.product_name).join(", "),
      o.items?.map(it => it.quantity).join(", "),
      o.receive_date,
      o.delivery_date,
      STATUS_LABELS[o.status],
      o.note || ""
    ]);
    autoTable(doc, {
      startY: 24,
      head: [["STT", "Mã đơn", "Khách hàng", "Sản phẩm", "Số lượng", "Ngày nhận", "Ngày giao", "Trạng thái", "Ghi chú"]],
      body: rows,
      theme: "grid",
      styles: { font: "helvetica", fontSize: 10 },
      headStyles: { fillColor: [33, 150, 243] }
    });
    doc.save("Danh_sach_don_hang.pdf");
  }

  // ========== COMPONENT EDIT ĐƠN HÀNG ==========
  function EditOrderModal({ order, onSave, onClose }) {
    // Chú ý: Bạn cần map lại field nếu muốn edit luôn theo schema mới!
    const [edit, setEdit] = useState({ ...order });
    return (
      <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
        <form
          className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative"
          onSubmit={e => { e.preventDefault(); onSave(edit); }}>
          <button type="button" onClick={onClose} className="absolute top-2 right-3 text-2xl">&times;</button>
          <h3 className="text-xl font-bold mb-4 text-blue-700">Sửa Đơn hàng: {order.code}</h3>
          <div className="mb-2">
            <label className="block mb-1">Khách hàng:</label>
            <input className="border p-2 rounded w-full" value={edit.customer_name} onChange={e => setEdit(ed => ({ ...ed, customer_name: e.target.value }))} />
          </div>
          <div className="mb-2">
            <label className="block mb-1">Sản phẩm:</label>
            {/* Nếu có nhiều sản phẩm cần render đúng dạng items, ở đây demo chỉ lấy sản phẩm đầu */}
            <input className="border p-2 rounded w-full"
              value={edit.items?.[0]?.product_name || ""}
              onChange={e => {
                const items = edit.items ? [...edit.items] : [{}];
                items[0] = { ...items[0], product_name: e.target.value };
                setEdit(ed => ({ ...ed, items }));
              }} />
          </div>
          <div className="mb-2">
            <label className="block mb-1">Số lượng:</label>
            <input type="number" min={1} className="border p-2 rounded w-full"
              value={edit.items?.[0]?.quantity || ""}
              onChange={e => {
                const items = edit.items ? [...edit.items] : [{}];
                items[0] = { ...items[0], quantity: e.target.value };
                setEdit(ed => ({ ...ed, items }));
              }} />
          </div>
          <div className="mb-2">
            <label className="block mb-1">Đơn vị:</label>
            <input className="border p-2 rounded w-full"
              value={edit.items?.[0]?.unit || ""}
              onChange={e => {
                const items = edit.items ? [...edit.items] : [{}];
                items[0] = { ...items[0], unit: e.target.value };
                setEdit(ed => ({ ...ed, items }));
              }} />
          </div>
          <div className="mb-2">
            <label className="block mb-1">Ghi chú:</label>
            <input className="border p-2 rounded w-full" value={edit.note} onChange={e => setEdit(ed => ({ ...ed, note: e.target.value }))} />
          </div>
          <div className="mb-2 flex gap-2">
            <div>
              <label className="block mb-1">Ngày nhận:</label>
              <input type="date" className="border p-2 rounded" value={edit.receive_date} onChange={e => setEdit(ed => ({ ...ed, receive_date: e.target.value }))} />
            </div>
            <div>
              <label className="block mb-1">Ngày giao:</label>
              <input type="date" className="border p-2 rounded" value={edit.delivery_date} onChange={e => setEdit(ed => ({ ...ed, delivery_date: e.target.value }))} />
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button type="button" onClick={onClose} className="mr-2 px-4 py-2 rounded bg-gray-300">Huỷ</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-700 text-white">Lưu thay đổi</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Quản lý Đơn hàng</h2>
      {/* Nút xuất PDF tất cả */}
      <button
        onClick={exportAllOrdersPDF}
        className="bg-purple-700 text-white px-4 py-2 rounded mb-4 mr-2"
      >
        Xuất PDF tất cả đơn hàng
      </button>
      {/* SEARCH + FILTER */}
      <div className="flex gap-3 mb-4">
        <input
          placeholder="Tìm khách hàng hoặc sản phẩm..."
          className="border p-2 rounded w-60"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">Tất cả trạng thái</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) =>
            <option key={k} value={k}>{v}</option>
          )}
        </select>
      </div>
      {/* Form thêm đơn */}
      <form className="flex flex-wrap gap-2 mb-6" onSubmit={handleAdd}>
        <input required placeholder="Khách hàng" value={form.customer_name}
          onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))} className="border rounded p-2" />
        <input required placeholder="Sản phẩm" value={form.product_name}
          onChange={e => setForm(f => ({ ...f, product_name: e.target.value }))} className="border rounded p-2" />
        <input required placeholder="Số lượng" type="number" min={1} value={form.quantity}
          onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} className="border rounded p-2 w-24" />
        <input placeholder="Đơn vị" value={form.unit}
          onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} className="border rounded p-2 w-24" />
        <input placeholder="Ghi chú" value={form.note}
          onChange={e => setForm(f => ({ ...f, note: e.target.value }))} className="border rounded p-2" />
        <input required type="date" value={form.receive_date}
          onChange={e => setForm(f => ({ ...f, receive_date: e.target.value }))} className="border rounded p-2" />
        <input required type="date" value={form.delivery_date}
          onChange={e => setForm(f => ({ ...f, delivery_date: e.target.value }))} className="border rounded p-2" />
        <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2">Thêm đơn</button>
      </form>
      {/* Loading */}
      {loading && <div>Đang tải dữ liệu...</div>}
      {/* Bảng danh sách đơn hàng */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th>Mã đơn</th>
            <th>Khách hàng</th>
            <th>Sản phẩm</th>
            <th>Số lượng</th>
            <th>Đơn vị</th>
            <th>Ngày nhận</th>
            <th>Ngày giao</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {pageOrders.map(o => (
            <tr key={o.id} className="border-t hover:bg-gray-50">
              <td>
                <button className="text-blue-700 underline" onClick={() => setShowDetail(o)}>
                  {o.code}
                  {isWarning(o) && (
                    <span title="Sắp đến hạn" className="ml-1 inline-block w-2 h-2 rounded-full bg-red-500 align-middle"></span>
                  )}
                </button>
              </td>
              <td>{o.customer_name}</td>
              <td>{o.items?.map(it => it.product_name).join(", ")}</td>
              <td>{o.items?.map(it => it.quantity).join(", ")}</td>
              <td>{o.items?.map(it => it.unit).join(", ")}</td>
              <td>{o.receive_date}</td>
              <td>{o.delivery_date}</td>
              <td>
                <StatusBadge status={o.status} />
                {isWarning(o) && (
                  <span className="ml-1 text-xs px-1 rounded bg-red-100 text-red-700">Nhắc nhở</span>
                )}
              </td>
              <td>
                <button onClick={() => setShowDetail(o)} className="text-blue-600 hover:underline">Chi tiết</button>
                <button onClick={() => setEditOrder(o)} className="text-orange-600 hover:underline ml-2">Sửa</button>
                <button onClick={() => exportOrderPDF(o)} className="text-purple-700 hover:underline ml-2">Xuất PDF</button>
                <button onClick={() => handleDelete(o.id)} className="text-red-600 hover:underline ml-2">Xoá</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination dưới bảng */}
      <div className="flex gap-2 items-center mt-2">
        <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1 border rounded">Trước</button>
        <span>Trang {page} / {totalPages || 1}</span>
        <button disabled={page === totalPages || totalPages === 0} onClick={() => setPage(page + 1)} className="px-3 py-1 border rounded">Sau</button>
      </div>
      {/* Popup chi tiết đơn */}
      {showDetail &&
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative">
            <button onClick={() => setShowDetail(null)} className="absolute top-2 right-3 text-2xl">&times;</button>
            <h3 className="text-xl font-bold mb-4 text-blue-700">Chi tiết Đơn hàng: {showDetail.code}</h3>
            <div className="mb-2"><b>Khách hàng:</b> {showDetail.customer_name}</div>
            <div className="mb-2"><b>Sản phẩm:</b> {showDetail.items?.map(it => it.product_name).join(", ")}</div>
            <div className="mb-2"><b>Số lượng:</b> {showDetail.items?.map(it => it.quantity).join(", ")}</div>
            <div className="mb-2"><b>Đơn vị:</b> {showDetail.items?.map(it => it.unit).join(", ")}</div>
            <div className="mb-2"><b>Ngày nhận:</b> {showDetail.receive_date}</div>
            <div className="mb-2"><b>Ngày giao:</b> {showDetail.delivery_date}</div>
            <div className="mb-2"><b>Ghi chú:</b> {showDetail.note}</div>
            <div className="mb-2"><b>Trạng thái:</b> <StatusBadge status={showDetail.status} /></div>
            {showDetail.history &&
              <div className="mt-6">
                <b>Lịch sử trạng thái:</b>
                <table className="w-full mt-2 text-xs">
                  <thead>
                    <tr className="bg-gray-100">
                      <th>Thời gian</th>
                      <th>Từ</th>
                      <th>Đến</th>
                      <th>Người thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(showDetail.history || []).map((h, i) => (
                      <tr key={i} className="border-t">
                        <td>{h.time}</td>
                        <td>{STATUS_LABELS[h.from] || "-"}</td>
                        <td>{STATUS_LABELS[h.to]}</td>
                        <td>{h.user}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            }
            <button onClick={() => exportOrderPDF(showDetail)} className="bg-purple-700 text-white px-4 py-2 rounded mt-4">
              Xuất PDF
            </button>
          </div>
        </div>
      }
      {/* Popup Edit đơn */}
      {editOrder &&
        <EditOrderModal
          order={editOrder}
          onSave={handleEditSave}
          onClose={() => setEditOrder(null)}
        />
      }
    </div>
  );
}
