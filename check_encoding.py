import os

for root, dirs, files in os.walk("."):
    for file in files:
        path = os.path.join(root, file)
        try:
            open(path, encoding="utf-8").read()
        except Exception as e:
            print(f"Lỗi ở file: {path} -- {e}")
