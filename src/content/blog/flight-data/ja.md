---
title: "Apache Airflowを使用した航空便データウェアハウス"
date: 2026-05-01
description: "Apache Airflow、Docker、PostgreSQLを使用したリアルタイム航空便データのデータウェアハウス実装。"
tags: [ "データエンジニアリング" ]
coverImage: "/media/blog/flight-data/flight-data-cover.jpg"
---
    ## ソースコード

このプロジェクトの完全なコードはGitHubで確認できます：[github.com/frchandra/flight-data](github.com/frchandra/flight-data)。

## コンセプト

このプロジェクトは、OpenSkyから分散したデータを取得し、変換し、品質を保証し、最終的にFactテーブルとDimensionテーブルで構成された構造化PostgreSQLデータベース（古典的なスタースキーマのデータウェアハウス設計）にロードするプロセスを自動化します。

## 使用技術

* **Apache Airflow:** コアオーケストレーター。ワークフロー（DAG）をスケジュール、管理、監視し、適切なタイミングでデータが取得され、依存関係が尊重されることを保証します。
* **Docker & Docker Compose:** 環境全体をコンテナ化。データベース、Airflow webserver、scheduler、workersがホストマシンに関係なく一貫して動作することを保証します。
* **PostgreSQL:** クリーニングおよび変換されたデータがクエリのために保存されるターゲットリレーショナルデータベース。
* **Python:** Airflow DAGとカスタムOperatorの記述に使用される言語。

## パイプライン

このプロジェクトの魔法は`dags/`フォルダ内で起こります。このフォルダには、異なるタイプのデータを処理する2つの異なる有向非巡回グラフ（DAG）が含まれています：

### 1. 航空機・空港パイプライン（`dag_etl_aircraft_data`）

* **スケジュール:** 週次実行（`@weekly`）。
* **目的:** 基礎となる参照データ（Dimensionテーブル）を構築。
* **フロー:**
    1. **抽出:** OpenSky Networkから直接メタデータCSVファイル（`AircraftTypes.csv`、`aircraftDatabase.csv`、および空港データ）をダウンロード。
    2. **ステージング:** この生のCSVデータをPostgreSQLの一時的なステージングテーブルにロード。
    3. **品質チェック:** 重要なフィールドがnullでないことを確認するためにSQLクエリを実行。
    4. **ロード:** ステージングされたデータを変換し、最終的な`dim_aircrafts`と`dim_airports`のDimensionテーブルにロード。

### 2. リアルタイム航空便データパイプライン（`dag_etl_flight_data`）

* **スケジュール:** 時間単位で実行（`@hourly`）。
* **目的:** 継続的な航空便の動きのストリーム（Factデータ）をキャプチャ。
* **フロー:**
    1. **抽出:** OpenSky REST APIにリクエストを送信し、特定の実行時間の航空便データを取得。
    2. **ステージング:** API JSONレスポンスを`staging_flights`テーブルにロード。
    3. **品質チェック:** 航空機識別子（`icao24`）が存在することを確認。
    4. **ロード:** データを大規模な`fact_flights`テーブルに挿入し、`dim_time` Dimensionテーブルを更新。

## 構築と実行方法

プロジェクトは完全にDockerコンテナ化されているため、セットアップは簡単です。

### ステップ1: クローンとビルド

まず、リポジトリをクローンします。次に、カスタムAirflowイメージをビルドします：

```bash
docker compose build
```

### ステップ2: コンテナの起動

クラスター全体をバックグラウンドで起動します：

```bash
docker compose up -d
```

### ステップ3: Airflowへのアクセス

ブラウザを開いて`http://localhost`に移動します。ログイン画面が表示されます：

![Airflowログイン画面](/media/blog/flight-data/dashboard-login.png)

デフォルトの認証情報を使用してログインします：

* **ユーザー名:** `airflow`
* **パスワード:** `airflow`

ログイン後、Airflowダッシュボードが表示されます：

![Airflowダッシュボード](/media/blog/flight-data/dashboard-home.png)

### ステップ4: 接続の設定

Airflow UIで**Admin > Connections**に移動します：

#### A. PostgreSQL接続

`postgres`という名前の新しいPostgres接続を追加します。`docker ps`を使用してデータベースコンテナ名を確認してください。

![Docker PS出力](/media/blog/flight-data/docker-ps.png)

以下のようにデータベース接続の詳細を設定します：

![データベース接続設定](/media/blog/flight-data/db-conf.png)

#### B. OpenSky API接続

ホスト`https://opensky-network.org`で`openskynetwork`という名前のHTTP接続を追加します。

![API接続パート1](/media/blog/flight-data/api-conf-1.png)
![API接続パート2](/media/blog/flight-data/api-conf-2.png)

### ステップ5: データベーススキーマの初期化

データベースコンテナに接続し、`create_table_statements.sql`に記載されたスクリプトを実行して必要なテーブルを作成します。

### ステップ6: DAGの起動！

Airflowホームページに戻り、DAGの一時停止を解除してランを起動し、データ収集を開始しましょう！
