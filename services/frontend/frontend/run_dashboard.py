import subprocess
import webbrowser
import time

# Đường dẫn tới thư mục frontend (chứa package.json)
frontend_dir = r'C:\Users\Q\Desktop\nhac nho\services\frontend\frontend'

# Chạy npm install
subprocess.run(['npm', 'install'], cwd=frontend_dir)

# Chạy npm run dev
p = subprocess.Popen(['npm', 'run', 'dev'], cwd=frontend_dir)

# Đợi cho server khởi động (thường 1-2 giây)
time.sleep(2)
webbrowser.open('http://localhost:5173')

input("Dashboard đang chạy... Nhấn Enter để thoát.\n")
p.terminate()
