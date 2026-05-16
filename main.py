import requests
import time
from datetime import datetime

# --- CẤU HÌNH THÔNG TIN TỪ ẢNH ---
URL = 'https://sapi.zalopay.vn/v2/history/categories'
COOKIE = (
    "zalo_id=; "
    "zlp_token=3vSqzAySPUYc5s4UpgYb6KyWUHbfrPxzYuZE6C3SD2VYVFMAd7RQpXk6Z8xPJdkzGfpu3AtireHP5jnmDjKsjbvgPjvJdyk8Zy7nWcrHFocYEyyP2DDAsCmuKVcrXwXAT1mfsHY5n3wg4iNJAQ5272qfQDfjmXQoNSi7pzNdpkzG34M36jYm6; "
    "X-DRSITE=off; has_device_id=0"
)

HEADERS = {
    'Host': 'sapi.zalopay.vn',
    'Accept': '*/*',
    'Origin': 'https://social.zalopay.vn',
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_7_11 like Mac OS X) AppleWebKit/8615.8.1.10.2 (KHTML, like Gecko) Mobile/20H351 ZaloPayClient/11.5.1 ZaloPayWebClient/11.5.1 OS/16.7.11 Platform/ios Secured/true',
    'Referer': 'https://social.zalopay.vn/spa/v2/history?main-app=true',
    'x-platform': 'ZPA',
    'Cookie': COOKIE,
    'Accept-Language': 'vi-VN,vi;q=0.9',
    'Connection': 'keep-alive'
}

def fetch_history():
    now = datetime.now().strftime("%H:%M:%S")
    try:
        response = requests.get(URL, headers=HEADERS, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print(f"[{now}] Thành công! Dữ liệu nhận được: {str(data)[:100]}...")
        else:
            print(f"[{now}] Lỗi HTTP: {response.status_code}")
            if response.status_code == 401:
                print("=> Token đã chết, hãy thay zlp_token mới.")
                
    except Exception as e:
        print(f"[{now}] Lỗi kết nối: {e}")

if __name__ == "__main__":
    print("Bot ZaloPay đang bắt đầu chạy (Chu kỳ: 60s)...")
    while True:
        fetch_history()
        # Nghỉ 60 giây trước khi gọi lần tiếp theo
        time.sleep(60)
