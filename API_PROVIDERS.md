# Danh Sách API Thời Tiết Miễn Phí

Dự án này hỗ trợ nhiều API thời tiết miễn phí. Bạn có thể chọn provider phù hợp với nhu cầu.

## 🌟 Open-Meteo (KHUYẾN NGHỊ - HOÀN TOÀN MIỄN PHÍ)

**Ưu điểm:**
- ✅ **HOÀN TOÀN MIỄN PHÍ** - Không cần đăng ký, không cần API key
- ✅ Không giới hạn số lượng requests
- ✅ Dữ liệu chính xác từ các mô hình thời tiết châu Âu
- ✅ Có dữ liệu lịch sử và dự báo

**Cách sử dụng:**
```bash
# Set environment variable
$env:API_PROVIDER="openmeteo"
npm start
```

Hoặc trong file `.env`:
```
API_PROVIDER=openmeteo
```

**Lưu ý:** Open-Meteo cần tọa độ (lat/lon) nên sẽ tự động sử dụng OpenWeatherMap Geocoding API (miễn phí) để lấy tọa độ từ tên thành phố. Nếu bạn có OpenWeatherMap API key, hãy thêm vào `.env` để tăng độ chính xác.

---

## 🌤️ OpenWeatherMap

**Ưu điểm:**
- ✅ Miễn phí 60 requests/phút
- ✅ Dữ liệu phong phú
- ✅ Hỗ trợ nhiều ngôn ngữ

**Giới hạn:**
- 60 requests/phút
- 1 triệu requests/tháng (gói miễn phí)

**Cách lấy API key:**
1. Truy cập: https://openweathermap.org/api
2. Đăng ký tài khoản miễn phí
3. Lấy API key từ dashboard

**Cách sử dụng:**
```bash
# Trong file .env
API_PROVIDER=openweather
OPENWEATHER_API_KEY=your_api_key_here
```

---

## 🌦️ WeatherAPI.com

**Ưu điểm:**
- ✅ Miễn phí 1 triệu requests/tháng
- ✅ Dữ liệu chất lượng cao
- ✅ Hỗ trợ nhiều tính năng

**Giới hạn:**
- 1 triệu requests/tháng (gói miễn phí)
- Không có giới hạn requests/phút

**Cách lấy API key:**
1. Truy cập: https://www.weatherapi.com/
2. Đăng ký tài khoản miễn phí
3. Lấy API key từ dashboard

**Cách sử dụng:**
```bash
# Trong file .env
API_PROVIDER=weatherapi
WEATHERAPI_KEY=your_api_key_here
```

---

## 📊 So Sánh

| API | Miễn phí | Cần API Key | Giới hạn | Ghi chú |
|-----|----------|-------------|----------|---------|
| **Open-Meteo** | ✅ Hoàn toàn | ❌ Không | Không giới hạn | **Khuyến nghị** |
| **OpenWeatherMap** | ✅ Có | ✅ Có | 60 req/phút | Phổ biến nhất |
| **WeatherAPI.com** | ✅ Có | ✅ Có | 1M req/tháng | Nhiều tính năng |

---

## 🔧 Cấu Hình

### Cách 1: Sử dụng file `.env`

Tạo file `.env` trong thư mục dự án:

```env
# Chọn API provider: 'openmeteo', 'openweather', hoặc 'weatherapi'
API_PROVIDER=openmeteo

# Nếu dùng OpenWeatherMap
OPENWEATHER_API_KEY=your_openweather_key

# Nếu dùng WeatherAPI.com
WEATHERAPI_KEY=your_weatherapi_key

# Port (optional)
PORT=3000
```

### Cách 2: Sử dụng Environment Variables

**Windows PowerShell:**
```powershell
$env:API_PROVIDER="openmeteo"
$env:OPENWEATHER_API_KEY="your_key"  # Nếu cần
npm start
```

**Linux/Mac:**
```bash
export API_PROVIDER=openmeteo
export OPENWEATHER_API_KEY=your_key  # Nếu cần
npm start
```

### Cách 3: Docker

Trong file `docker-compose.yml`, thêm vào `environment`:
```yaml
environment:
  - API_PROVIDER=openmeteo
  - OPENWEATHER_API_KEY=${OPENWEATHER_API_KEY}
  - WEATHERAPI_KEY=${WEATHERAPI_KEY}
```

---

## 🚀 Khuyến Nghị

**Cho người mới bắt đầu:**
- Sử dụng **Open-Meteo** - Không cần đăng ký, không cần API key

**Cho dự án production:**
- Sử dụng **OpenWeatherMap** hoặc **WeatherAPI.com** - Có API key riêng, dễ quản lý

**Cho dự án lớn:**
- Có thể kết hợp nhiều API để có fallback khi một API bị lỗi

---

## 📝 Lưu ý

- Open-Meteo cần tọa độ (lat/lon), nên sẽ tự động sử dụng OpenWeatherMap Geocoding API để chuyển đổi tên thành phố thành tọa độ
- Nếu không có OpenWeatherMap API key, Open-Meteo vẫn có thể hoạt động nhưng độ chính xác có thể giảm
- Tất cả các API đều trả về dữ liệu theo format chuẩn, frontend không cần thay đổi

---

## 🔗 Links

- Open-Meteo: https://open-meteo.com/
- OpenWeatherMap: https://openweathermap.org/api
- WeatherAPI.com: https://www.weatherapi.com/

