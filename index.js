// 📦 더미 데이터 구성 (초기 설치용 가상 친구 데이터)
const DEFAULT_FRIENDS = [
    { id: 1, name: "김구름", status: "green", availableTime: "18:00 ~ 20:00", text: "수다 대환영" },
    { id: 2, name: "이몽글", status: "yellow", availableTime: "내일 비어요", text: "카톡만 가능" },
    { id: 3, name: "박하늘", status: "red", availableTime: "회의 중", text: "전화 금지" },
    { id: 4, name: "최솜사탕", status: "green", availableTime: "지금 바로 가능", text: "심심해" }
];

// 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", () => {
    initClock();
    loadMySchedules();
    loadFriendList();
    loadMatchList();

    // 일정 등록 폼 이벤트 리스너
    document.getElementById("schedule-form").addEventListener("submit", (e) => {
        e.preventDefault();
        addSchedule();
    });
});

// ⏰ 상단 현재 시간 실시간 갱신
function initClock() {
    const timeDisplay = document.getElementById("current-time-display");
    function updateClock() {
        const now = new Date();
        timeDisplay.innerText = `📅 ${now.toLocaleDateString()} │ ⏰ ${now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    }
    updateClock();
    setInterval(updateClock, 60000);
}

// 🗺️ 페이지 전환 기능
function switchPage(pageId, element) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
    
    document.getElementById(`page-${pageId}`).classList.add("active");
    element.classList.add("active");
}

// 🔴🟡🟢 상단 퀵 상태 변경 함수
function setMyQuickStatus(statusCode) {
    const statusLabels = { green: "🟢 통화가능", yellow: "🟡 문자가능", red: "🔴 통화불가" };
    alert(`내 상태가 [${statusLabels[statusCode]}] 상태로 변경되었습니다.`);
    localStorage.setItem("myCurrentStatus", statusCode);
    loadMatchList(); // 상호 매칭 정보 갱신
}

// 📝 [기능 1] 내 일정 관리 (Local Storage 저장 및 불러오기)
function addSchedule() {
    const title = document.getElementById("schedule-title").value;
    const startTime = document.getElementById("start-time").value;
    const endTime = document.getElementById("end-time").value;
    const status = document.getElementById("schedule-status").value;

    const newSchedule = { id: Date.now(), title, startTime, endTime, status };
    
    let schedules = JSON.parse(localStorage.getItem("mySchedules")) || [];
    schedules.push(newSchedule);
    // 시간순 정렬
    schedules.sort((a, b) => a.startTime.localeCompare(b.startTime));
    
    localStorage.setItem("mySchedules", JSON.stringify(schedules));
    
    document.getElementById("schedule-form").reset();
    loadMySchedules();
    loadMatchList();
}

function loadMySchedules() {
    const container = document.getElementById("my-timeline");
    let schedules = JSON.parse(localStorage.getItem("mySchedules")) || [];

    if (schedules.length === 0) {
        container.innerHTML = `<p class="subtitle" style="text-align:center; padding:10px;">등록된 오늘 일정이 없습니다. ☁️</p>`;
        return;
    }

    const statusMap = { green: "통화가능", yellow: "문자가능", red: "통화불가" };

    container.innerHTML = schedules.map(s => `
        <div class="timeline-item">
            <div>
                <strong>[${s.startTime} ~ ${s.endTime}]</strong> ${s.title}
            </div>
            <span class="badge ${s.status}">${statusMap[s.status]}</span>
        </div>
    `).join('');
}

// 👥 [기능 2] 친구 일정/상태 리스트 렌더링
function loadFriendList() {
    const container = document.getElementById("friend-list");
    const statusMap = { green: "통화가능", yellow: "문자가능", red: "통화불가" };

    container.innerHTML = DEFAULT_FRIENDS.map(f => `
        <div class="friend-item">
            <div>
                <strong>${f.name}</strong> <span style="font-size:0.8rem; color:#78909c;">(${f.text})</span>
                <div style="font-size:0.8rem; color:#90a4ae; margin-top:2px;">🕒 여가: ${f.availableTime}</div>
            </div>
            <span class="badge ${f.status}">${statusMap[f.status]}</span>
        </div>
    `).join('');
}

// ✨ [창의적 기능 3] 실시간 상호 매칭 방 구축 (내 상태가 Green일 때 연락가능한 친구 노출)
function loadMatchList() {
    const container = document.getElementById("match-list");
    const myCurrentStatus = localStorage.getItem("myCurrentStatus") || "green";
    
    // 내 상태가 green(통화가능)이거나 혹은 내 오늘 일정 중 green 상태가 있는지 모방 검사
    const greenFriends = DEFAULT_FRIENDS.filter(f => f.status === "green");

    if (myCurrentStatus !== "green") {
        container.innerHTML = `
            <p class="subtitle" style="text-align:center; padding:20px;">
                현재 내 상태가 🟢<b>통화가능</b> 일 때만 <br>실시간 연락 골든타임 매칭이 활성화됩니다.
            </p>`;
        return;
    }

    container.innerHTML = greenFriends.map(f => `
        <div class="match-item">
            <div>
                <strong>🎉 ${f.name}님과 매칭됨!</strong>
                <div style="font-size:0.8rem; color:#66bb6a; margin-top:2px;">지금 서로 바로 통화할 수 있는 타이밍이에요!</div>
            </div>
            <button class="ping-btn" onclick="sendPing('${f.name}')">📞 찌르기</button>
        </div>
    `).join('');
}

function sendPing(name) {
    alert(`☁️ [지금시간?] 알림 \n${name}님에게 "나 지금 통화 가능해!" 찌르기 신호를 보냈습니다.`);
}
