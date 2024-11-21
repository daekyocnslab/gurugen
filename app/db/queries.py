# 데이터베이스 쿼리 함수 모음

from app.db.connector import get_connection, DENT_FIELDS
from datetime import datetime


def calculate_total_dents(report):
    """덴트 합계 계산"""
    return sum(int(report.get(field, 0) or 0) for field in DENT_FIELDS)


def fetch_reports():
    """모든 보고서를 조회하여 정렬"""
    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM car_dent_analysis;")
            results = cursor.fetchall()

    for report in results:
        report['total_dents'] = calculate_total_dents(report)
    return sorted(results, key=lambda x: x['analyze_time'], reverse=True)


def fetch_report_by_id(report_id):
    """특정 ID의 보고서를 조회"""
    with get_connection() as connection:
        with connection.cursor() as cursor:
            # 쿼리 수정: 각 섹션의 합계(total)와 기존 필드를 포함
            cursor.execute("""
                SELECT 
                    *,
                    -- 각 섹션의 덴트 합산
                    (left_dent_large + left_dent_medium + left_dent_small) AS left_dent_total,
                    (right_dent_large + right_dent_medium + right_dent_small) AS right_dent_total,
                    (front_dent_large + front_dent_medium + front_dent_small) AS front_dent_total,
                    (tail_dent_large + tail_dent_medium + tail_dent_small) AS tail_dent_total,
                    -- 각 섹션의 덴트 합산 (필요 시 추가)
                    (left_dent_large + left_dent_medium + left_dent_small+right_dent_large + right_dent_medium + right_dent_small+front_dent_large + front_dent_medium + front_dent_small+tail_dent_large + tail_dent_medium + tail_dent_small) AS total_dents,
                    -- 각 섹션의 스크래치 합산 (필요 시 추가)
                    (left_scratch + right_scratch + front_scratch + tail_scratch) AS total_scratch,
                    -- 각 섹션의 데미지 합산 (필요 시 추가)
                    (left_damage + right_damage + front_damage + tail_damage) AS total_damage
                FROM 
                    car_dent_analysis
                WHERE 
                    id = %s
            """, (report_id,))
            return cursor.fetchone()


def filter_reports_by_date_and_car(date, car_number):
    """날짜와 차량 번호로 보고서를 필터링"""
    with get_connection() as connection:
        with connection.cursor() as cursor:
            query = "SELECT * FROM car_dent_analysis WHERE DATE(analyze_time) = %s"
            params = [date]
            if car_number:
                query += " AND car_number = %s"
                params.append(car_number)
            cursor.execute(query, params)
            filtered_reports = cursor.fetchall()

    for report in filtered_reports:
        report['total_dents'] = calculate_total_dents(report)
    return filtered_reports


def insert_report(data):
    """새로운 보고서 데이터를 삽입"""
    data_time = data.get('data_time', datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    analyze_time = data.get('analyze_time', datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    dent_data = {field: data.get(field, 0) for field in DENT_FIELDS}
    with get_connection() as connection:
        with connection.cursor() as cursor:
            insert_data_query = '''
                INSERT INTO car_dent_analysis (car_number, file_name, {fields}, data_time, analyze_time)
                VALUES (%s, %s, {placeholders}, %s, %s);
            '''.format(
                fields=", ".join(dent_data.keys()),
                placeholders=", ".join(["%s"] * len(dent_data))
            )
            cursor.execute(insert_data_query, (
                data['car_number'], data['file_name'], *dent_data.values(), data_time, analyze_time
            ))
            connection.commit()