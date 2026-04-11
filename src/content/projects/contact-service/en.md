---
title: "Contact Service"
date: 2026-02-10
description: "A lightweight microservice for handling contact form submissions with spam protection and email delivery."
tags: ["Node.js", "Express", "Docker", "hCaptcha"]
thumbnail: "/media/projects/contact-service/thumb.jpg"
externalUrl: "https://github.com/frchandra/contact-service"
---

## Overview

A small, focused microservice that handles the backend for the Veranda contact form. It validates submissions, verifies hCaptcha tokens, and forwards messages to the site owner via email.

## Goals

- Keep it simple: one responsibility, one service
- Stateless and containerized — deploys as a Docker container on the same internal network as Veranda
- No database required: contact submissions are forwarded directly via SMTP

## Technical Stack

- **Runtime:** Node.js 20 (LTS)
- **Framework:** Express.js — minimal overhead
- **Spam Protection:** hCaptcha server-side token verification
- **Email Delivery:** Nodemailer with SMTP transport
- **Containerization:** Docker, exposed only on the internal Docker network

## API

The service exposes a single endpoint:

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

Returns `200 OK` on success, `400` for validation errors, `422` for failed captcha verification.

## Security Considerations

- Rate limiting via `express-rate-limit`
- Input sanitization before forwarding
- CORS restricted to the Veranda origin only
- Not exposed to the public internet — only reachable from within the Docker network
