import Accordion from './Accordion.js';
import Popup from './Popup.js';

let selectedDate = null; // 현재 선택된 날짜
let selectedReportId = null; // 현재 선택된 아코디언 항목 ID

// 초기화
function initialize() {
    setupDatePicker(); // DatePicker 초기화
    setupEventListeners(); // 이벤트 리스너 등록
    setTodayAsDefault();//오늘의 데이터 초기화
}

// DatePicker 설정
function setupDatePicker() {
    $("#datepickerDent").datepicker({
        dateFormat: 'yy-mm-dd',
        showMonthAfterYear: true,
        monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        changeMonth: true,
        changeYear: true,
        showOtherMonths: true,
        selectOtherMonths: true,
        onChangeMonthYear: function (year, month, inst) {
            setTimeout(() => {
                addYearSuffix();
            }, 0);
        },
        onSelect: (dateText) => {
            if (selectedDate === dateText) {
                console.log("동일한 날짜 선택으로 filterReports 호출 중단.");
                return;
            }

            $(".search-section p").text(`${dateText} 총 분석 차량 수`);
            filterReports(dateText); // 새로운 날짜로 보고서 필터링
        }
    });
    addYearSuffix(); // '년' 텍스트 추가
}

// '년' 텍스트 추가
function addYearSuffix() {
    $(".ui-datepicker-year option").each(function () {
        const yearText = $(this).val();
        $(this).text(yearText + "년");
    });
}

// 디바운싱 함수
function debounce(func, delay) {
    let debounceTimer;
    return function (...args) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func(...args), delay);
    };
}

// 이벤트 리스너 추가
function setupEventListeners() {
    document.querySelector("#resultAccordion").addEventListener("click", handleAccordionClick);

    const partLists = document.querySelectorAll(".parts-list li");
    partLists.forEach(part => {
        part.addEventListener("click", handleVideoClick);
    });

    const $printBtn = document.querySelector("#printResult");
    $printBtn.addEventListener("click", () => {
        print();
    });

    // filterReports 함수에 디바운싱 적용
    const filterReportsDebounced = debounce(filterReports, 300);

    // 검색 입력 필드에 이벤트 연결
    document.querySelector(".search-input").addEventListener("input", (event) => {
        const searchTerm = event.target.value;
        filterReportsDebounced(null, searchTerm); // 날짜(null)와 검색어(searchTerm)를 분리하여 전달
    });
}

//오늘의 데이터 초기화
function setTodayAsDefault() {
    // 오늘 날짜 설정
    const today = new Date();
    $("#datepickerDent").datepicker("setDate", today);

    // 오늘 날짜로 텍스트 및 데이터 설정
    const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
    $(".search-section p").text(`${formattedDate} 총 분석 차량 수`);

    // 오늘 날짜로 보고서 필터링
    filterReports(formattedDate);
}

// 아코디언 클릭 처리
async function handleAccordionClick(event) {
    const target = event.target;

    // 차량 헤드
    const clickedVehicle = target.closest(".accord-head");

    // 부품 리스트
    const clickedPart = target.closest("li");

    // 차량 헤드 클릭 시
    if (clickedVehicle) {
        // 모든 아코디언 헤드에서 isDent 클래스 제거
        const allVehicles = document.querySelectorAll(".accord-head");
        allVehicles.forEach(vehicle => vehicle.classList.remove("isDent"));

        // 현재 클릭된 아코디언 헤드에 isDent 클래스 추가
        clickedVehicle.classList.add("isDent");

        // 차량 ID 및 파일 이름 가져오기
        const partsList = clickedVehicle.parentElement.querySelector(".parts-list");
        const fileNameBase = partsList.dataset.fileName;

        // 차량 ID 가져오기
        const vehicleId = partsList?.dataset.id;

        if (!vehicleId) {
            console.error("Vehicle ID가 없습니다.");
            return;
        }

        // 선택한 항목이 이전과 동일한 경우 호출 중단
        if (vehicleId && selectedReportId === vehicleId) {
            console.log("동일한 아코디언 항목 클릭으로 loadReport 호출 중단.");
            return;
        }

        // 새로운 항목인 경우 데이터 로드
        if (vehicleId) {
            loadReport(vehicleId);
        }

        // 파일 이름 확인
        if (!fileNameBase) {
            console.error("파일 이름이 없습니다.");
            return;
        }

        // 동영상 존재 여부 확인
        const videoChecks = await Promise.all(
            Array.from({length: 6}).map(async (_, i) => {
                const cameraNumber = `cam${i + 1}`;
                const videoFileName = `${fileNameBase}_${cameraNumber}.webm`;
                const response = await fetch(`/video/exists/${encodeURIComponent(videoFileName)}`);
                return {
                    fileName: videoFileName,
                    exists: response.ok,
                };
            })
        );

        // 하위 리스트 활성화/비활성화 처리
        const partItems = partsList.querySelectorAll("li");
        videoChecks.forEach((videoCheck, index) => {
            const partItem = partItems[index];
            if (!partItem) return;

            // 동영상이 있는 경우 활성화
            if (videoCheck.exists) {
                partItem.classList.remove("disabled"); // 활성화
                partItem.style.color = "black";
                partItem.dataset.videoFileName = videoCheck.fileName;
            } else {
                // 동영상이 없는 경우 비활성화
                partItem.classList.add("disabled"); // 비활성화
                partItem.style.color = "gray";
                partItem.removeAttribute("data-video-file-name");
            }
        });

        // console.log(videoChecks); // 디버깅용
        return;
    }

    // 부품 리스트 클릭 시
    if (clickedPart) {
        // 동영상 여부 확인
        if (clickedPart.classList.contains("disabled")) {
            alert("동영상이 없습니다.");
            return; // 클릭 이벤트 차단
        }

        // `data-video-file-name` 속성 읽기
        const fileName = clickedPart.dataset.videoFileName;
        {
            // console.log("Part clicked:", clickedPart.dataset); //디버깅용

            showPopUp(clickedPart.dataset, fileName); // 팝업 표시
            return;
        }
    }

}

// 보고서 필터링
window.filterReports = function filterReports(date = null, carNumber = "") {
    const currentDate = $("#datepickerDent").datepicker("getDate");
    const formattedDate = date || (currentDate ? formatDateTimeUTC(currentDate) : null);

    // 날짜가 유효하지 않은 경우 처리
    if (!formattedDate) {
        console.log("유효하지 않은 날짜입니다.");
        return;
    }
    //
    // // 기존 선택된 날짜와 검색어가 동일하면 중단
    // if (selectedDate === formattedDate && !carNumber) {
    //     console.log("동일한 날짜로 filterReports 호출 중단.");
    //     return;
    // }

    // 새로운 날짜로 상태 업데이트
    selectedDate = formattedDate;

    const searchInput = carNumber.trim();

    // 디버깅: 전달된 값 확인
    // console.log("Selected Date:", selectedDate);
    // console.log("Search Input:", searchInput);


    fetch(`/filter_reports?date=${encodeURIComponent(selectedDate)}&car_number=${encodeURIComponent(searchInput)}`)
        .then((response) => response.json())
        .then((data) => {
            updateAccordion(data); // 아코디언 업데이트
            if (data.length > 0) {
                loadReport(data[0].id); // 첫 번째 보고서 로드
            }
        })
        .catch(console.error);
};

// 아코디언 업데이트
function updateAccordion(data) {
    const accordion = document.querySelector("#resultAccordion");
    accordion.innerHTML = "";

    // total-num 업데이트
    const totalNumElement = document.querySelector(".total-num");

    // 데이터가 없을 경우 처리
    if (data.length < 1) {
        accordion.innerHTML = '<li class="no-results">검색 결과가 없습니다.</li>';
        totalNumElement.textContent = "0";
        document.querySelector(".pannel-content").innerHTML = `
                <ul class="summary-list">
                    <li><dl><dt>차량 번호</dt><dd></dd></dl></li>
                    <li><dl><dt>입차 일시</dt><dd></dd></dl></li>
                    <li><dl><dt>분석 일시</dt><dd></dd></dl></li>
                </ul>
                <div class="dent-total">
                    <h4 class="title">전체 덴트 수량</h4>
                    <table class="table">
                        <tr><th>구분</th><td>덴트</td><td>스크래치</td><td>데미지</td></tr>
                        <tr><th>수량</th><td></td><td></td><td></td></tr>
                    </table>
                </div>
                <article class="vehicle-wrap">
                    <div class="__vehicle-bg"></div>
                    ${generateDentTable('A', 'A 좌측', data.left_dent_total || 0, data.left_scratch || 0, data.left_damage || 0)}
                    ${generateDentTable('B', 'B 본넷', data.front_dent_total || 0, data.front_scratch || 0, data.front_damage || 0)}
                    ${generateDentTable('C', 'C 우측', data.right_dent_total || 0, data.right_scratch || 0, data.right_damage || 0)}
                    ${generateDentTable('D', 'D 트렁크(테일 게이트)', data.tail_dent_total || 0, data.tail_scratch || 0, data.tail_damage || 0)}
                </article>`;
        return;
    }

    totalNumElement.textContent = data.length;

    data.forEach(vehicle => {
        const listItem = document.createElement("li");
        listItem.className = "result-item accord-item";
        listItem.innerHTML = `
                <div class="accord-head">
                    <svg class="icon" width="20" height="20" viewBox="0 0 20 20" fill="#1D1D1E" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M14 10.4865L6 16V4L14 10.4865Z"/>
                    </svg>
                  <span class="text">${vehicle.car_number}${vehicle.total_dents ? ` (${vehicle.total_dents})` : ''}</span>
                </div>
                <div class="accord-body">
                    <ul class="parts-list" data-id="${vehicle.id}" data-file-name="${vehicle.file_name}">
                        <li data-date="${vehicle.data_time}" data-number="${vehicle.car_number}" data-file-name="${vehicle.file_name}_cam1" data-part="우측 하단">우측 하단 (camera01)</li>
                        <li data-date="${vehicle.data_time}" data-number="${vehicle.car_number}" data-file-name="${vehicle.file_name}_cam2" data-part="우측 중간">우측 중간 (camera02)</li>
                        <li data-date="${vehicle.data_time}" data-number="${vehicle.car_number}" data-file-name="${vehicle.file_name}_cam3" data-part="우측 상단">우측 상단 (camera03)</li>
                        <li data-date="${vehicle.data_time}" data-number="${vehicle.car_number}" data-file-name="${vehicle.file_name}_cam4" data-part="좌측 하단">좌측 하단 (camera04)</li>
                        <li data-date="${vehicle.data_time}" data-number="${vehicle.car_number}" data-file-name="${vehicle.file_name}_cam5" data-part="좌측 중간">좌측 중간 (camera05)</li>
                        <li data-date="${vehicle.data_time}" data-number="${vehicle.car_number}" data-file-name="${vehicle.file_name}_cam6" data-part="좌측 상단">좌측 상단 (camera06)</li>
                    </ul>
                </div>`;
        accordion.appendChild(listItem);
    });

    new Accordion("#resultAccordion");
}

// 보고서 로드
function loadReport(reportId) {
    // 동일한 reportId이면 호출하지 않음
    if (selectedReportId === reportId) {
        console.log("동일한 reportId로 loadReport 호출 중단.");
        return;
    }

    selectedReportId = reportId; // 새로운 보고서 ID로 갱신

    fetch(`/report/${reportId}`)
        .then((response) => response.json())
        .then((data) => {
            updateMainPanel(data); // 메인 패널 업데이트
            updatePrintView(data); // 프린트 뷰 업데이트
        })
        .catch(console.error);
}

// 메인 패널 업데이트
function updateMainPanel(data) {
    selectedReportId = data.id;

    document.querySelector(".pannel-content").innerHTML = `
            <ul class="summary-list">
                <li><dl><dt>차량 번호</dt><dd>${data.car_number}</dd></dl></li>
                <li><dl><dt>입차 일시</dt><dd>${formatDateTime(data.data_time)}</dd></dl></li>
                <li><dl><dt>분석 일시</dt><dd>${formatDateTime(data.analyze_time)}</dd></dl></li>
            </ul>
            <div class="dent-total">
                <h4 class="title">전체 덴트 수량</h4>
                <table class="table">
                    <tr><th>구분</th><td>덴트</td><td>스크래치</td><td>데미지</td></tr>
                    <tr><th>수량</th><td>${data.total_dent}</td><td>${data.total_scratch}</td><td>${data.total_damage}</td></tr>
                </table>
            </div>
            <article class="vehicle-wrap">
                <div class="__vehicle-bg"></div>
                ${generateDentTable('A', 'A 좌측', data.left_dent_total, data.left_scratch, data.left_damage)}
                ${generateDentTable('B', 'B 본넷', data.front_dent_total, data.front_scratch, data.front_damage)}
                ${generateDentTable('C', 'C 우측', data.right_dent_total, data.right_scratch, data.right_damage)}
                ${generateDentTable('D', 'D 트렁크(테일 게이트)', data.tail_dent_total, data.tail_scratch, data.tail_damage)}
            </article>`;
}

// 덴트 테이블 생성 함수
function generateDentTable(section, sectionName, dent, scratch, damage) {
    return `
            <div class="dent-table-box ${section}">
                <h4 class="title">${sectionName}</h4>
                <table class="table">
                    <tbody>
                        <tr>
                            <th>구분</th>
                            <th>수량</th>
                        </tr>
                        <tr>
                            <td>덴트</td>
                            <td>${dent || 0}</td>
                        </tr>
                         <tr>
                            <td>스크래치</td>
                            <td>${scratch || 0}</td>
                        </tr>
                        <tr>
                            <td>데미지</td>
                            <td>${damage || 0}</td>
                        </tr>
                    </tbody>
                </table>
            </div>`;
}

// 프린트 화면 업데이트
function updatePrintView(data) {
    const printView = document.querySelector("#printView .print-content");

    if (!printView) {
        console.error("#printView .print-content 요소를 찾을 수 없습니다.");
        return; // 함수 종료
    }

    // 현재 날짜 가져오기
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = (today.getMonth() + 1).toString().padStart(2, '0');
    const todayDay = today.getDate().toString().padStart(2, '0');

    // 차량 기본 정보 테이블
    const vehicleInfo = `
            <div class="total-box">
                <table class="table">
                    <colgroup>
                        <col width="15%">
                        <col width="15%">
                        <col width="15%">
                        <col width="auto">
                        <col width="auto">
                    </colgroup>
                    <thead>
                        <tr>
                            <th>차량번호</th>
                            <th>차종</th>
                            <th>고객명</th>
                            <th>입차 일시</th>
                            <th>분석 일시</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${data.car_number || ""}</td>
                            <td>${data.car_type || ""}</td>
                            <td>${data.customer_name || ""}</td>
                            <td>${formatDateTime(data.data_time)}</td>
                            <td>${formatDateTime(data.analyze_time)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;

    // 각 위치별 덴트 결과 테이블 생성
    const dentTables = `
        ${generatePrintDentTable('A', 'A 좌측', data.left_dent_total, data.left_scratch, data.left_damage)}
        ${generatePrintDentTable('B', 'B 본넷', data.front_dent_total, data.front_scratch, data.front_damage)}
        ${generatePrintDentTable('C', 'C 우측', data.right_dent_total, data.right_scratch, data.right_damage)}
        ${generatePrintDentTable('D', 'D 트렁크(테일 게이트)', data.tail_dent_total, data.tail_scratch, data.tail_damage)}
    `;

    // 전체 덴트 수량 테이블
    const totalDent = `
        <div class="dent-total">
            <h4 class="title-square primary">전체 덴트 수량</h4>
            <div class="table-round">
                <table class="table table-dashed">
                    <colgroup>
                        <col width="25%">
                        <col width="25%">
                        <col width="25%">
                        <col width="25%">
                    </colgroup>
                    <tbody>
                        <tr>
                            <th>구분</th>
                            <td>덴트</td>
                            <td>스크래치</td>
                            <td>데미지</td>
                        </tr>
                        <tr>
                            <th>수량</th>
                            <td>${data.total_dent || 0}</td>
                            <td>${data.total_scratch || 0}</td>
                            <td>${data.total_damage || 0}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

    // 기타 사항 및 서명 정보
    const otherMatters = `
        <div class="other-matter">
            <h4 class="title-square">기타 사항</h4>
            <div class="table-round">${data.other_matter || ""}</div>
        </div>
    `;

    const signForm = `
        <div class="sign-form">
            <div class="container">
                <h5 class="title">차량 외관의 덴트 분석을 위한 영상 촬영에 동의합니다.</h5>
                <ul>
                    <li>• 본 영상은 차량의 덴트분석용으로만 사용됩니다.</li>
                    <li>• 본 영상은 사업소 내에서만 이용합니다.</li>
                    <li>• 본 영상의 최대 보관 기간은 30일이며, 이후 영구 삭제됩니다.</li>
                </ul>
            </div>
            <div class="sign-box">
                <span class="__date">
                    <span>${todayYear}</span>년
                    <span>${todayMonth}</span>월
                    <span>${todayDay}</span>일
                </span>
                <span>의뢰인(성명 및 서명)</span>
                <span class="text-right">(인)</span>
            </div>
        </div>
    `;

    // 최종적으로 업데이트
    printView.innerHTML = `
        <h1 class="logo"></h1>
        <h2 class="print-title">차량 덴트 분석 결과</h2>
        ${vehicleInfo}
        <div class="container">
            <div class="vehicle-wrap">
                <h3 class="title"><span class="icon-vehicle"></span>분석 결과</h3>
                <div class="__vehicle-bg"></div>
                ${dentTables}
            </div>
            ${totalDent}
            ${otherMatters}
        </div>
        ${signForm}
    `;
}

// 프린트 화면 덴트 테이블 생성 함수
function generatePrintDentTable(section, sectionName, dent, scratch, damage) {
    return `
            <div class="dent-table-box ${section}">
                <h4 class="title">${sectionName} <span class="icon-arrow"></span></h4>
                <div class="table-round">
                    <table class="table table-dashed">
                        <thead>
                            <tr>
                                <th>구분</th>
                                <th>수량</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>덴트</td>
                                <td>${dent || 0}</td>
                            </tr>
                            <tr>
                                <td>스크래치</td>
                                <td>${scratch || 0}</td>
                            </tr>
                            <tr>
                                <td>데미지</td>
                                <td>${damage || 0}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>`;
}

// 날짜 및 시간 포맷 (UTC)
function formatDateTimeUTC(dateTime) {
    // 입력된 날짜 문자열을 Date 객체로 변환
    const date = new Date(dateTime);
    return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, "0")}.${date.getDate().toString().padStart(2, "0")} / ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;
}

// 날짜 및 시간 포맷 (KST)
function formatDateTime(dateTime) {
    // 입력된 날짜 문자열을 Date 객체로 변환
    const date = new Date(dateTime);

    // KST 기준으로 변환 (UTC-9)
    const kstOffset = -9 * 60; // KST offset in minutes
    const kstDate = new Date(date.getTime() - kstOffset * 60 * 1000);

    // 포맷팅
    return `${kstDate.getFullYear()}.${(kstDate.getMonth() + 1).toString().padStart(2, "0")}.${kstDate.getDate().toString().padStart(2, "0")} / ${kstDate.getHours().toString().padStart(2, "0")}:${kstDate.getMinutes().toString().padStart(2, "0")}:${kstDate.getSeconds().toString().padStart(2, "0")}`;
}

// 캠 리스트 클릭 시 동영상 팝업 처리
async function handleVideoClick(event) {
    const clickedPart = event.target.closest("li");
    if (!clickedPart) return;

    // 비활성화된 리스트는 동작하지 않음
    if (clickedPart.classList.contains("disabled")) {
        alert("동영상이 없습니다.");
        return;
    }

    // 동영상 파일 이름 가져오기
    const fileName = clickedPart.dataset.fileName;
    if (!fileName) {
        console.error("파일 이름이 없습니다.");
        return;
    }

    try {
        // 서버에서 파일 존재 여부 확인
        const response = await fetch(`/video/exists/${encodeURIComponent(fileName)}`);
        if (response.ok) {
            // 파일이 존재하면 팝업 표시
            showPopUp(clickedPart.dataset, fileName);
        } else {
            alert("해당 동영상 파일이 존재하지 않습니다.");
        }
    } catch (error) {
        console.error("동영상 파일 확인 중 오류 발생:", error);
    }
}

// 동영상 팝업 표시
function showPopUp(clickedPart, fileName) {
    const $container = document.querySelector("#vehicleVideoPop .title-text");
    const videoElement = document.querySelector(".vehicle-video");

    if (!$container) console.error("#vehicleVideoPop .title-text 요소를 찾을 수 없습니다.");
    if (!videoElement) console.error(".vehicle-video 요소를 찾을 수 없습니다.");

    if ($container && videoElement && fileName !== undefined) {
        // 비디오 소스 업데이트
        videoElement.src = `/video/${encodeURIComponent(fileName)}`;
        videoElement.play();

        // 팝업 정보 업데이트
        $container.innerHTML = `
            <span class="date">${formatDateTime(clickedPart.date)}</span>
            <span class="number">${clickedPart.number}</span>
            <span class="part">${clickedPart.part}</span>
        `;

        // 팝업 열기
        const popup = new Popup("#vehicleVideoPop");
        if (!popup) {
            console.error("Popup 모듈 초기화 실패.");
            return;
        }
        popup.open();
        console.log("팝업 열림");
    } else {
        console.error("팝업 컨테이너나 비디오 요소를 찾을 수 없습니다.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
// 초기화 실행
    initialize();
});

