# Weather App

Ứng dụng thời tiết đơn giản và đẹp mắt được xây dựng với HTML, CSS, JavaScript và Node.js/Express backend.

## Tính năng

- 🔍 Tìm kiếm thời tiết theo tên thành phố
- 🌡️ Hiển thị nhiệt độ, độ ẩm và tốc độ gió
- 🎨 Giao diện đẹp với hiệu ứng glassmorphism
- 📱 Responsive design
- 🌈 Hiển thị icon thời tiết phù hợp với điều kiện
- 🔒 Backend API proxy để bảo vệ API key
- 🐳 Docker support để dễ dàng deploy
- 🌟 **Hỗ trợ nhiều API miễn phí** - Bao gồm Open-Meteo (KHÔNG CẦN API KEY!)

## Cài đặt

### Cách chạy:
    - Mở Terminal trong thư mục dự án
    - Và chạy lệnh npm run start:auto



## Sử dụng

1. Nhập tên thành phố vào ô tìm kiếm
2. Nhấn nút tìm kiếm hoặc nhấn Enter
3. Xem thông tin thời tiết hiển thị

## Cấu trúc thư mục

```
weather-app/
├── assets/
│   ├── bg.jpg                    # Background image
│   ├── message/                  # Message images
│   │   ├── not-found.png
│   │   └── search-city.png
│   └── weather/                  # Weather icons
│       ├── atmosphere.svg
│       ├── clear.svg
│       ├── clouds.svg
│       ├── drizzle.svg
│       ├── rain.svg
│       ├── snow.svg
│       └── thunderstorm.svg
├── src/
│   ├── index.html                # Main HTML file
│   ├── script.js                 # Frontend JavaScript
│   └── style.css                 # Styles
├── server.js                     # Backend Express server
├── package.json                  # Node.js dependencies
├── Dockerfile                    # Docker configuration
├── docker-compose.yml            # Docker Compose configuration
├── .dockerignore                 # Docker ignore file
└── README.md                     # This file
```

## API Endpoints

### GET `/api/weather?city={cityName}`
Lấy thông tin thời tiết của thành phố

**Query Parameters:**
- `city` (required): Tên thành phố

**Response:**
```json
{
  "weather": [...],
  "main": {
    "temp": 25,
    "humidity": 60
  },
  "wind": {
    "speed": 3.5
  },
  "name": "Ho Chi Minh City",
  "sys": {
    "country": "VN"
  }
}
```

### GET `/health`
Health check endpoint

**Response:**
```json
{
  "status": "ok"
}
```

## Công nghệ sử dụng

### Frontend
- HTML5
- CSS3 (Glassmorphism effects)
- Vanilla JavaScript

### Backend
- Node.js
- Express.js
- node-fetch (API proxy)

### Infrastructure
- Docker
- Docker Compose

### External API
- OpenWeatherMap API

## API Providers

Dự án hỗ trợ **3 API thời tiết miễn phí**:

1. **🌟 Open-Meteo** (Khuyến nghị) - **HOÀN TOÀN MIỄN PHÍ, KHÔNG CẦN API KEY!**
2. **OpenWeatherMap** - Miễn phí 60 requests/phút
3. **WeatherAPI.com** - Miễn phí 1 triệu requests/tháng

Xem chi tiết tại: [API_PROVIDERS.md](./API_PROVIDERS.md)

## Environment Variables

- `API_PROVIDER` (optional): Chọn API provider - `openmeteo` (mặc định), `openweather`, hoặc `weatherapi`
- `OPENWEATHER_API_KEY` (optional): API key từ OpenWeatherMap (chỉ cần nếu dùng OpenWeatherMap)
- `WEATHERAPI_KEY` (optional): API key từ WeatherAPI.com (chỉ cần nếu dùng WeatherAPI)
- `PORT` (optional): Port cho server, mặc định là 3000

## Docker Commands

### Build image:
```bash
docker build -t weather-app .
```

### Run container:
```bash
docker run -p 3000:3000 -e OPENWEATHER_API_KEY=your_key weather-app
```

### Stop container:
```bash
docker-compose down
```

### View logs:
```bash
docker-compose logs -f
```

## Lưu ý

- Cần có kết nối internet để sử dụng API
- API key miễn phí có giới hạn số lượng request mỗi phút
- API key được lưu ở backend, không expose ra frontend
- Đảm bảo file `.env` không được commit lên git (đã có trong .dockerignore)

## License

MIT
