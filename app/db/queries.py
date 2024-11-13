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
            cursor.execute("SELECT * FROM car_dent_analysis WHERE id=%s", (report_id,))
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