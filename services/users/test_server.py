from fastapi import FastAPI

app = FastAPI()

@app.get("/ping")
def ping():
    print("PING CALLED!")
    return {"msg": "pong"}
