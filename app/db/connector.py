# 데이터베이스 연결 설정

import pymysql
import os
from dotenv import load_dotenv
from datetime import datetime
from app.config import config

# 덴트 관련 필드 목록
DENT_FIELDS = [
    "front_dent_small", "front_dent_medium", "front_dent_large", "front_scratch", "front_damage",
    "left_dent_small", "left_dent_medium", "left_dent_large", "left_scratch", "left_damage",
    "right_dent_small", "right_dent_medium", "right_dent_large", "right_scratch", "right_damage",
    "tail_dent_small", "tail_dent_medium", "tail_dent_large", "tail_scratch", "tail_damage"
]


# DB 연결 함수
def get_connection():
    """DB 연결을 생성하는 함수"""
    return pymysql.connect(
        host=config.DB_HOST,
        port=config.DB_PORT,
        user=config.DB_USER,
        password=config.DB_PASSWORD,
        database=config.DB_NAME,
        cursorclass=pymysql.cursors.DictCursor
    )


# 테이블 생성 함수
def create_table():
    """데이터베이스에 테이블을 생성하는 함수"""
    with get_connection() as connection:
        with connection.cursor() as cursor:
            create_table_query = f'''
            CREATE TABLE IF NOT EXISTS car_dent_analysis (
                id INT AUTO_INCREMENT PRIMARY KEY,
                car_number VARCHAR(20) NOT NULL,
                file_name VARCHAR(255) NOT NULL,
                {", ".join([f"{field} INT DEFAULT 0" for field in DENT_FIELDS])},
                data_time DATETIME,
                analyze_time DATETIME
            );
            '''
            cursor.execute(create_table_query)
            connection.commit()


# 데이터 삽입 함수
def insert_data(car_number, file_name, dent_data, data_time, analyze_time):
    """데이터를 데이터베이스에 삽입하는 함수"""
    dent_values = [dent_data.get(field, 0) for field in DENT_FIELDS]
    with get_connection() as connection:
        with connection.cursor() as cursor:
            insert_data_query = f'''
            INSERT INTO car_dent_analysis (
                car_number, file_name, {", ".join(DENT_FIELDS)}, data_time, analyze_time
            ) VALUES (%s, %s, {", ".join(["%s"] * len(DENT_FIELDS))}, %s, %s);
            '''
            cursor.execute(insert_data_query, (car_number, file_name, *dent_values, data_time, analyze_time))
            connection.commit()


# 데이터 조회 함수
def fetch_data():
    """데이터베이스에서 데이터를 조회하는 함수"""
    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM car_dent_analysis;")
            return cursor.fetchall()


# 예제 실행
if __name__ == "__main__":
    # 테이블 생성
    create_table()

    # 데이터 삽입 예시
    car_number = "12AB3456"
    file_name = "car_image_1.jpg"
    dent_data = {field: 0 for field in DENT_FIELDS}
    data_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    analyze_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    # 데이터 삽입
    insert_data(car_number, file_name, dent_data, data_time, analyze_time)

    # 데이터 조회 및 출력
    results = fetch_data()
    for row in results:
        print(row)