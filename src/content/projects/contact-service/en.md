---
title: "Contact Service"
date: 2026-02-15
description: "A serverless contact form backend with Cloudflare Turnstile verification and email forwarding via Workers."
tags: ["Cloudflare Workers", "TypeScript", "Serverless"]
thumbnail: "/media/projects/contact-service/thumb.jpg"
externalUrl: "https://github.com/frchandra/contact-service"
---

## Overview

Contact Service is a lightweight, serverless backend designed to handle contact form submissions. It integrates Cloudflare Turnstile for bot protection and uses Cloudflare Workers to process and forward form data as structured emails.

## Goals

The goal was to build a zero-dependency contact form handler that could be deployed at the edge, eliminating the need for a traditional backend server. The service needed to be fast, secure, and compatible with the Veranda website's static architecture.

## Stack

- **Runtime:** Cloudflare Workers
- **Language:** TypeScript
- **Bot Protection:** Cloudflare Turnstile
- **Email:** MailChannels API via Workers

## Approach

The service exposes a single POST endpoint that validates the Turnstile token server-side, sanitizes the form input, and dispatches an email through the MailChannels integration. Rate limiting is handled at the Workers level, and CORS is configured to only accept requests from known origins.
