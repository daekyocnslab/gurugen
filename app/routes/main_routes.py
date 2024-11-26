# 주요 라우트 정의 (e.g., 비디오 관련, 보고서 조회)

import os
from distutils.command.config import config

from flask import Blueprint, request, jsonify, render_template, send_from_directory
from datetime import datetime
from dotenv import load_dotenv
from app.config import config  # config 모듈에서 VIDEO_FOLDER 설정을 가져옴
from app.db.queries import fetch_reports, fetch_report_by_id, filter_reports_by_date_and_car, insert_report

# 블루프린트 생성
main_routes = Blueprint('main_routes', __name__)


def get_video_files(file_name):
    """특정 파일 이름을 기반으로 6개의 영상 파일 목록 반환"""
    # config.VIDEO_FOLDER에서 file_name과 일치하는 파일들을 확인
    return [
        f"{file_name}_cam{i}.webm"
        for i in range(1, 7)
        if os.path.exists(os.path.join(config.VIDEO_FOLDER, f"{file_name}_cam{i}.webm"))
    ]

@main_routes.route('/video/list/<file_name>', methods=['GET'])
def video_list(file_name):
    """파일 이름을 기반으로 관련 비디오 파일 목록 반환"""
    video_files = get_video_files(file_name)
    return jsonify(video_files)

@main_routes.route('/video/<path:filename>', methods=['GET'])
def video(filename):
    """비디오 파일 반환"""
    try:
        return send_from_directory(config.VIDEO_FOLDER, filename)
    except FileNotFoundError:
        return "File not found", 404

@main_routes.route('/video/exists/<path:filename>', methods=['GET'])
def video_exists(filename):
    """동영상 파일 존재 여부 확인"""
    real_folder = os.path.realpath(config.VIDEO_FOLDER)
    file_path = os.path.join(real_folder, filename)
    if os.path.exists(file_path):
        return jsonify({"exists": True}), 200
    else:
        return jsonify({"exists": False}), 404

@main_routes.route('/')
def main_page():
    reports = fetch_reports()
    return render_template('index.html', reports=reports)

@main_routes.route('/report/<int:report_id>')
def report_page(report_id):
    report_data = fetch_report_by_id(report_id)
    if not report_data:
        return jsonify({"error": "Report not found"}), 404
    return jsonify(report_data)

@main_routes.route('/api/insert', methods=['POST'])
def insert_json_data():
    data = request.get_json()
    insert_report(data)
    return jsonify({"message": "Data inserted successfully!"}), 200

@main_routes.route('/filter_reports')
def filter_reports():
    date = request.args.get('date')
    car_number = request.args.get('car_number', '').strip()
    reports = filter_reports_by_date_and_car(date, car_number)
    return jsonify(reports)