---
title: "Air flight Data Warehouse with Apache Airflow"
date: 2026-05-01
description: "Implementing a data warehouse for live flight data using Apache Airflow, Docker, and PostgreSQL."
tags: [ "data engineering" ]
coverImage: "/media/blog/flight-data/flight-data-cover.jpg"
---
    ## Source Code

You can find the full code for this project on GitHub: [github.com/frchandra/flight-data](github.com/frchandra/flight-data).

## Concept

This project automates the process of fetching this disparate data from OpenSky, transforming it, ensuring its quality,
and ultimately loading it into a structured PostgreSQL database configured with Fact and Dimension tables (a classic
Star Schema data warehouse design).

## Tech Inside

* **Apache Airflow:** The core orchestrator. It schedules, manages, and monitors the workflows (DAGs) to ensure data is
  fetched at the right time and dependencies are respected.
* **Docker & Docker Compose:** Containerizes the entire environment. It ensures that the database, Airflow webserver,
  scheduler, and workers run consistently regardless of the host machine.
* **PostgreSQL:** The target relational database where the cleaned and transformed data is stored for querying.
* **Python:** The language used to write the Airflow DAGs and custom Operators.

## Pipelines

The magic of this project happens inside the `dags/` folder, which contains two distinct Directed Acyclic Graphs (DAGs)
that handle different types of data:

### 1. The Aircraft & Airport Pipeline (`dag_etl_aircraft_data`)

* **Schedule:** Runs Weekly (`@weekly`).
* **Purpose:** Builds the underlying reference data (Dimension tables).
* **Flow:**
    1. **Extract:** Downloads metadata CSV files (`AircraftTypes.csv`, `aircraftDatabase.csv`, and airport data)
       directly from the OpenSky Network.
    2. **Stage:** Loads this raw CSV data into temporary staging tables in PostgreSQL.
    3. **Quality Check:** Runs SQL queries to ensure critical fields are not null.
    4. **Load:** Transforms and loads the staged data into the final `dim_aircrafts` and `dim_airports` dimension
       tables.

### 2. The Live Flight Data Pipeline (`dag_etl_flight_data`)

* **Schedule:** Runs Hourly (`@hourly`).
* **Purpose:** Captures the continuous stream of flight movements (Fact data).
* **Flow:**
    1. **Extract:** Makes requests to the OpenSky REST API to fetch flight data for the specific execution hour.
    2. **Stage:** Loads the API JSON responses into the `staging_flights` table.
    3. **Quality Check:** Ensures aircraft identifiers (`icao24`) are present.
    4. **Load:** Inserts the data into the massive `fact_flights` table and updates the `dim_time` dimension tables.

## How to Build and Run It

Since the project is fully dockerized, setting it up is straightforward.

### Step 1: Clone and Build

First, clone the repository. Then, build the custom Airflow image:

```bash
docker compose build
```

### Step 2: Spin Up the Containers

Start the entire cluster in the background:

```bash
docker compose up -d
```

### Step 3: Access Airflow

Open your browser and navigate to `http://localhost`. You should see the login screen:

![Airflow Login Screen](/media/blog/flight-data/dashboard-login.png)

Log in using the default credentials:

* **Username:** `airflow`
* **Password:** `airflow`

Once logged in, you'll see the Airflow Dashboard:

![Airflow Dashboard](/media/blog/flight-data/dashboard-home.png)

### Step 4: Configure Connections

Go to **Admin > Connections** in the Airflow UI:

#### A. PostgreSQL Connection

Add a new Postgres connection named `postgres`. Use `docker ps` to find your database container name.

![Docker PS Output](/media/blog/flight-data/docker-ps.png)

Set up the database connection details as shown below:

![Database Connection Configuration](/media/blog/flight-data/db-conf.png)

#### B. OpenSky API Connection

Add an HTTP connection named `openskynetwork` with the host `https://opensky-network.org`.

![API Connection Part 1](/media/blog/flight-data/api-conf-1.png)
![API Connection Part 2](/media/blog/flight-data/api-conf-2.png)

### Step 5: Initialize the Database Schema

Connect to your database container and run the scripts provided in `create_table_statements.sql` to create the required
tables.

### Step 6: Launch the DAGs!

Return to the Airflow home page, unpause the DAGs, and trigger a run to start collecting your data!
