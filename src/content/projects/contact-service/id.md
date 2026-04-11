---
title: "Contact Service"
date: 2026-02-10
description: "Microservice ringan untuk menangani pengiriman formulir kontak dengan perlindungan spam dan pengiriman email."
tags: ["Node.js", "Express", "Docker", "hCaptcha"]
thumbnail: "/media/projects/contact-service/thumb.jpg"
externalUrl: "https://github.com/frchandra/contact-service"
---

## Gambaran Umum

Sebuah microservice kecil yang terfokus untuk menangani backend formulir kontak Veranda. Layanan ini memvalidasi pengiriman, memverifikasi token hCaptcha, dan meneruskan pesan ke pemilik situs melalui email.

## Tujuan

- Tetap sederhana: satu tanggung jawab, satu layanan
- Stateless dan terkontainerisasi — dideploy sebagai kontainer Docker di jaringan internal yang sama dengan Veranda
- Tidak memerlukan database: pengiriman kontak langsung diteruskan melalui SMTP

## Tumpukan Teknologi

- **Runtime:** Node.js 20 (LTS)
- **Framework:** Express.js — overhead minimal
- **Perlindungan Spam:** Verifikasi token hCaptcha sisi server
- **Pengiriman Email:** Nodemailer dengan transport SMTP
- **Containerisasi:** Docker, hanya diekspos di jaringan Docker internal

## API

Layanan ini mengekspos satu endpoint:

```
POST /submit
Content-Type: application/json

{
  "name": "string",
  "email": "string",
  "subject": "string",
  "message": "string",
  "hcaptchaToken": "string"
}
```

Mengembalikan `200 OK` jika berhasil, `400` untuk kesalahan validasi, `422` untuk verifikasi captcha yang gagal.

## Pertimbangan Keamanan

- Pembatasan laju dengan `express-rate-limit`
- Sanitasi input sebelum penerusan
- CORS dibatasi hanya untuk origin Veranda
- Tidak diekspos ke internet publik — hanya dapat dijangkau dari dalam jaringan Docker
