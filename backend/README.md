# DevLife-AngleHack-Backend

# Khởi chạy database server
`docker-compose -f docker-compose.yaml up`

- Mọi người truy cập vào url `http://localhost:8081` đây là UI quản lý MongoDB (như MongoDB Compass) 
- username: `admin` và passowrd: `pass` 

# Khởi chạy chương trình
`cargo watch -q -c -w src/ -x run`