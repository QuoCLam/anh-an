export default function StatusBadge({ status }) {
  let color, text;
  switch (status) {
    case "pending":
      color = "bg-yellow-100 text-yellow-800 border-yellow-300";
      text = "Chờ duyệt";
      break;
    case "approved":
      color = "bg-blue-100 text-blue-800 border-blue-300";
      text = "Đã duyệt";
      break;
    case "purchasing":
      color = "bg-orange-100 text-orange-800 border-orange-300";
      text = "Mua vật tư";
      break;
    case "producing":
      color = "bg-indigo-100 text-indigo-800 border-indigo-300";
      text = "Sản xuất";
      break;
    case "qc":
      color = "bg-purple-100 text-purple-800 border-purple-300";
      text = "Kiểm nghiệm";
      break;
    case "packing":
      color = "bg-pink-100 text-pink-800 border-pink-300";
      text = "Đóng gói";
      break;
    case "shipping":
      color = "bg-sky-100 text-sky-800 border-sky-300";
      text = "Giao hàng";
      break;
    case "done":
      color = "bg-green-100 text-green-800 border-green-300";
      text = "Hoàn thành";
      break;
    case "cancelled":
      color = "bg-gray-100 text-gray-500 border-gray-300";
      text = "Đã huỷ";
      break;
    default:
      color = "bg-gray-100 text-gray-700 border-gray-300";
      text = status;
  }
  return (
    <span className={`inline-block px-2 py-1 rounded-full border text-xs font-bold ${color}`}>
      {text}
    </span>
  );
}
