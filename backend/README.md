# 🙊 Speechless Back-End

스피치 연습 플랫폼 Speechless의 Back-End 입니다.

## 개발 환경

- Java 17
- Spring Boot 3.2.1
- Spring Data JPA
- Gradle
- Openvidu

<br/>

## 소스 코드 빌드

- 이하 설정 파일 내용을 채워 application.yml로 만들어 /resources 아래로 복사

```
---
# application
spring:
  profiles:
    active: prod

# Context path
---
server:
  servlet:
    context-path: /speechless

# SpringDoc Swagger
---
springdoc:
  api-docs:
    path: /api-docs
  swagger-ui:
    path: /swagger-ui.html

---
api-keys:
  gpt: GPT-API KEY
  pronounce: PRONOUNCE-TEST-KEY
  stt:
    secret-key: STT-KEY
    invoke-url: STT-URL
  storage:
    access-key: STORAGE-KEY
    secret-key: STORAGE-SECRET
    buket-name: 

---

OPENVIDU_URL: 
OPENVIDU_SECRET: OPENVIDU_SECRET

---
# port
server:
  port: 8080
  shutdown: graceful
---

# database
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: DB-URL
    username: DB-USER-NAME
    password: DB-USER-PASSWORD

---

# jpa
spring:
  jpa:
    database: mysql
    database-platform: org.hibernate.dialect.MySQL8Dialect
    generate-ddl: false
    hibernate:
      ddl-auto: none
    properties:
      hibernate:
        format_sql: true
        show_sql: true #로컬에서만 true로 설정 요망
        default_batch_fetch_size: 30

---
# OAuth/Kakao
oauth:
  kakao:
    client-id: OAuth client-id
    redirect-uri: kakao login redirect-url
    client-secret: OAuth client-secret

---

---
# OAuth/Naver
oauth:
  naver:
    client-id: OAuth client-id
    redirect-uri: http://localhost:8080/login/oauth2/code/naver
    client-secret: OAuth client-secret

---

# OAuth/Google
oauth:
  google:
    client-id: OAuth client-id
    redirect-uri: http://localhost:8080/login/oauth2/code/google
    client-secret: OAuth client-secret

---

# jwt
jwt:
  secret-key: jwt secret key
  access-token-expiration-time: 3600000
  refresh-token-expiration-time: 1209600000

---
# log
logging:
  level:
    org.hibernate.SQL: error
    org.hibernate.type: error
```

