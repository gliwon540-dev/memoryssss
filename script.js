/* ==========================================
   기억을 잇다 - 완전 새 navigation
========================================== */

let step = 1;

let emotion = "";
let feeling = "";
let category = "";


/* ==========================================
   STEP 화면 변경
========================================== */

function changeStep(number) {

    if (number < 1 || number > 4) {
        return;
    }

    step = number;

    // 모든 화면 숨기기
    document.querySelectorAll(".step").forEach(function(item) {
        item.classList.remove("active");
    });

    // 현재 화면 표시
    const current = document.getElementById("step" + step);

    if (current) {
        current.classList.add("active");
    }

    // 진행 점
    for (let i = 1; i <= 4; i++) {

        const dot = document.getElementById("dot" + i);

        if (!dot) continue;

        if (i === step) {
            dot.classList.add("on");
        } else {
            dot.classList.remove("on");
        }
    }

    // 이전 버튼
    const prev = document.getElementById("prevButton");

    if (prev) {
        prev.style.visibility =
            step === 1 ? "hidden" : "visible";
    }

    // 다음 / 저장 버튼
    const next = document.getElementById("nextButton");
    const save = document.getElementById("saveButton");

    if (step === 4) {

        if (next) {
            next.style.display = "none";
        }

        if (save) {
            save.style.display = "block";
        }

    } else {

        if (next) {
            next.style.display = "block";
        }

        if (save) {
            save.style.display = "none";
        }
    }
}


/* ==========================================
   다음
========================================== */

function nextStep() {

    console.log("NEXT:", step);

    if (step === 1) {
        changeStep(2);
    }

    else if (step === 2) {
        changeStep(3);
    }

    else if (step === 3) {
        changeStep(4);
    }
}


/* ==========================================
   이전
========================================== */

function previousStep() {

    console.log("PREVIOUS:", step);

    if (step === 4) {
        changeStep(3);
    }

    else if (step === 3) {
        changeStep(2);
    }

    else if (step === 2) {
        changeStep(1);
    }
}


/* ==========================================
   감정
========================================== */

function chooseEmotion(button, value) {

    document
        .querySelectorAll("#step2 .choices button")
        .forEach(function(item) {
            item.classList.remove("selected");
        });

    button.classList.add("selected");

    emotion = value;
}


/* ==========================================
   지금의 기분
========================================== */

function chooseFeeling(button, value) {

    document
        .querySelectorAll("#step3 .choices button")
        .forEach(function(item) {
            item.classList.remove("selected");
        });

    button.classList.add("selected");

    feeling = value;
}


/* ==========================================
   카테고리
========================================== */

function chooseCategory(button, value) {

    document
        .querySelectorAll("#step4 .choices button")
        .forEach(function(item) {
            item.classList.remove("selected");
        });

    button.classList.add("selected");

    category = value;
}


/* ==========================================
   다른 섹션 이동
========================================== */

function moveToSection(id) {

    const element = document.getElementById(id);

    if (element) {
        element.scrollIntoView({
            behavior: "smooth"
        });
    }
}


/* ==========================================
   공감
========================================== */

function showEmpathy(text) {

    const element =
        document.getElementById("empathyMessage");

    if (element) {
        element.textContent =
            "“" + text + "” 마음이 전달되었어요.";
    }
}


/* ==========================================
   페이지가 열리면 STEP 1
========================================== */

document.addEventListener("DOMContentLoaded", function() {

    changeStep(1);

});
