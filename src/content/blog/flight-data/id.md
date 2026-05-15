---
title: "Data Warehouse Penerbangan Udara dengan Apache Airflow"
date: 2026-05-01
description: "Mengimplementasikan data warehouse untuk data penerbangan live menggunakan Apache Airflow, Docker, dan PostgreSQL."
tags: [ "rekayasa data" ]
coverImage: "/media/blog/flight-data/flight-data-cover.jpg"
---

## Source Code

Anda dapat menemukan seluruh kode untuk project ini di
GitHub: [github.com/frchandra/flight-data](github.com/frchandra/flight-data).

## Konsep

Project ini mengotomatisasi proses pengambilan data yang tersebar dari OpenSky, mentransformasikannya, memastikan
kualitasnya,
dan akhirnya memuatnya ke dalam database PostgreSQL terstruktur yang dikonfigurasi dengan tabel Fact dan Dimension (
desain
data warehouse Star Schema klasik).

## Teknologi yang Digunakan

* **Apache Airflow:** Orchestrator utama. Bertugas menjadwalkan, mengelola, dan memonitor workflow (DAG) untuk
  memastikan data
  diambil pada waktu yang tepat dan dependency tetap terjaga.
* **Docker & Docker Compose:** Melakukan containerization pada seluruh environment. Memastikan database, Airflow
  webserver,
  scheduler, dan worker berjalan secara konsisten tanpa bergantung pada host machine.
* **PostgreSQL:** Database relasional target tempat data yang telah dibersihkan dan ditransformasikan disimpan untuk
  querying.
* **Python:** Bahasa pemrograman yang digunakan untuk menulis DAG Airflow dan Operator custom.

## Pipeline

Keajaiban project ini terjadi di dalam folder `dags/`, yang berisi dua Directed Acyclic Graphs (DAG)
berbeda untuk menangani jenis data yang berbeda:

### 1. Pipeline Aircraft & Airport (`dag_etl_aircraft_data`)

* **Schedule:** Berjalan mingguan (`@weekly`).
* **Tujuan:** Membangun data referensi dasar (tabel Dimension).
* **Alur:**
    1. **Extract:** Mengunduh file metadata CSV (`AircraftTypes.csv`, `aircraftDatabase.csv`, dan data airport)
       langsung dari OpenSky Network.
    2. **Stage:** Memuat data CSV mentah ini ke temporary staging table di PostgreSQL.
    3. **Quality Check:** Menjalankan query SQL untuk memastikan field penting tidak bernilai null.
    4. **Load:** Mentransformasikan dan memuat data staging ke tabel dimension final `dim_aircrafts` dan `dim_airports`.

### 2. Pipeline Data Penerbangan Live (`dag_etl_flight_data`)

* **Schedule:** Berjalan setiap jam (`@hourly`).
* **Tujuan:** Menangkap aliran pergerakan penerbangan secara kontinu (data Fact).
* **Alur:**
    1. **Extract:** Melakukan request ke OpenSky REST API untuk mengambil data penerbangan pada execution hour tertentu.
    2. **Stage:** Memuat response JSON API ke tabel `staging_flights`.
    3. **Quality Check:** Memastikan identifier pesawat (`icao24`) tersedia.
    4. **Load:** Memasukkan data ke tabel besar `fact_flights` dan memperbarui tabel dimension `dim_time`.

## Cara Build dan Menjalankannya

Karena project ini sepenuhnya sudah menggunakan Docker, proses setup menjadi cukup sederhana.

### Langkah 1: Clone dan Build

Pertama, clone repository-nya. Kemudian, build custom image Airflow:

```bash
docker compose build
```

### Langkah 2: Menjalankan Container

Jalankan seluruh cluster di background:

```bash
docker compose up -d
```

### Langkah 3: Akses Airflow

Buka browser Anda dan akses `http://localhost`. Anda akan melihat halaman login:

![Airflow Login Screen](/media/blog/flight-data/dashboard-login.png)

Login menggunakan credential default:

* **Username:** `airflow`
* **Password:** `airflow`

Setelah login, Anda akan melihat Airflow Dashboard:

![Airflow Dashboard](/media/blog/flight-data/dashboard-home.png)

### Langkah 4: Konfigurasi Connection

Masuk ke **Admin > Connections** pada UI Airflow:

#### A. PostgreSQL Connection

Tambahkan connection Postgres baru dengan nama `postgres`. Gunakan `docker ps` untuk menemukan nama container database
Anda.

![Docker PS Output](/media/blog/flight-data/docker-ps.png)

Atur detail koneksi database seperti yang ditunjukkan di bawah ini:

![Database Connection Configuration](/media/blog/flight-data/db-conf.png)

#### B. OpenSky API Connection

Tambahkan HTTP connection bernama `openskynetwork` dengan host `https://opensky-network.org`.

![API Connection Part 1](/media/blog/flight-data/api-conf-1.png)
![API Connection Part 2](/media/blog/flight-data/api-conf-2.png)

### Langkah 5: Inisialisasi Schema Database

Hubungkan ke container database Anda dan jalankan script yang tersedia di `create_table_statements.sql`
untuk membuat tabel yang dibutuhkan.

### Langkah 6: Jalankan DAG!

Kembali ke halaman utama Airflow, aktifkan DAG, lalu trigger run untuk mulai mengumpulkan data Anda!