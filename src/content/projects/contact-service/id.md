---
title: "Contact Service"
date: 2026-02-15
description: "Backend formulir kontak serverless dengan verifikasi Cloudflare Turnstile dan penerusan email melalui Workers."
tags: ["Cloudflare Workers", "TypeScript", "Serverless"]
thumbnail: "/media/projects/contact-service/thumb.jpg"
externalUrl: "https://github.com/frchandra/contact-service"
---

## Ikhtisar

Contact Service adalah backend serverless ringan yang dirancang untuk menangani pengiriman formulir kontak. Layanan ini mengintegrasikan Cloudflare Turnstile untuk perlindungan bot dan menggunakan Cloudflare Workers untuk memproses serta meneruskan data formulir sebagai email terstruktur.

## Tujuan

Tujuannya adalah membangun penangan formulir kontak tanpa dependensi yang dapat di-deploy di edge, menghilangkan kebutuhan akan server backend tradisional. Layanan ini harus cepat, aman, dan kompatibel dengan arsitektur statis situs web Veranda.

## Teknologi

- **Runtime:** Cloudflare Workers
- **Bahasa:** TypeScript
- **Perlindungan Bot:** Cloudflare Turnstile
- **Email:** MailChannels API melalui Workers

## Pendekatan

Layanan ini mengekspos satu endpoint POST yang memvalidasi token Turnstile di sisi server, membersihkan input formulir, dan mengirimkan email melalui integrasi MailChannels. Pembatasan rate ditangani di level Workers, dan CORS dikonfigurasi untuk hanya menerima permintaan dari origin yang dikenal.
