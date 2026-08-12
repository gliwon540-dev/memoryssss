/* =====================================================
   기억을 잇다
   MEMORY APP
===================================================== */


/* =====================================================
   SUPABASE 설정
===================================================== */

/*
   아래 두 곳만 네 Supabase 정보로 바꾸면 됨.
*/

const SUPABASE_URL =
    "여기에_SUPABASE_URL";


const SUPABASE_KEY =
    "여기에_SUPABASE_PUBLISHABLE_KEY";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );



/* =====================================================
   MEMORY STATE
===================================================== */

let currentStep = 1;

let selectedEmotion = "";

let selectedFeeling = "";

let selectedCategory = "";

let memories = [];

let currentFilter = "전체";



/* =====================================================
   SECTION 이동
===================================================== */

function moveToSection(id) {

    const section =
        document.getElementById(id);


    if (!section) {
        return;
    }


    section.scrollIntoView({
        behavior: "smooth"
    });

}



/* =====================================================
   ★ STEP 표시
===================================================== */

function showStep(step) {

    /*
       범위 제한
    */

    if (step < 1) {
        step = 1;
    }

    if (step > 4) {
        step = 4;
    }


    currentStep = step;



    /*
       모든 step 숨기기
    */

    document
        .querySelectorAll(".step")
        .forEach(function(element) {

            element.classList.remove("active");

        });



    /*
       현재 step 보여주기
    */

    const currentElement =
        document.getElementById(
            "step" + currentStep
        );


    if (currentElement) {

        currentElement.classList.add("active");

    }



    /*
       점 표시
    */

    for (let i = 1; i <= 4; i++) {

        const dot =
            document.getElementById(
                "dot" + i
            );


        if (!dot) {
            continue;
        }


        if (i === currentStep) {

            dot.classList.add("on");

        } else {

            dot.classList.remove("on");

        }

    }



    /*
       이전 버튼
    */

    const previousButton =
        document.getElementById(
            "prevButton"
        );


    if (previousButton) {

        if (currentStep === 1) {

            previousButton.style.visibility =
                "hidden";

        } else {

            previousButton.style.visibility =
                "visible";

        }

    }



    /*
       다음 버튼 / 저장 버튼
    */

    const nextButton =
        document.getElementById(
            "nextButton"
        );


    const saveButton =
        document.getElementById(
            "saveButton"
        );


    if (currentStep === 4) {

        if (nextButton) {

            nextButton.style.display =
                "none";

        }


        if (saveButton) {

            saveButton.style.display =
                "block";

        }

    } else {

        if (nextButton) {

            nextButton.style.display =
                "block";

        }


        if (saveButton) {

            saveButton.style.display =
                "none";

        }

    }

}



/* =====================================================
   ★★★ 다음 버튼 ★★★
===================================================== */

function nextStep() {

    /*
       이 함수는 Supabase와 아무 상관 없음.
       버튼을 누르면 무조건 다음 단계로 이동.
    */


    if (currentStep === 1) {

        showStep(2);

        return;

    }


    if (currentStep === 2) {

        showStep(3);

        return;

    }


    if (currentStep === 3) {

        showStep(4);

        return;

    }

}



/* =====================================================
   ★★★ 이전 버튼 ★★★
===================================================== */

function previousStep() {

    if (currentStep === 4) {

        showStep(3);

        return;

    }


    if (currentStep === 3) {

        showStep(2);

        return;

    }


    if (currentStep === 2) {

        showStep(1);

        return;

    }

}



/* =====================================================
   감정 선택
===================================================== */

function chooseEmotion(
    button,
    value
) {

    document
        .querySelectorAll(
            "#step2 .choices button"
        )
        .forEach(function(item) {

            item.classList.remove(
                "selected"
            );

        });


    button.classList.add(
        "selected"
    );


    selectedEmotion = value;

}



/* =====================================================
   지금의 기분 선택
===================================================== */

function chooseFeeling(
    button,
    value
) {

    document
        .querySelectorAll(
            "#step3 .choices button"
        )
        .forEach(function(item) {

            item.classList.remove(
                "selected"
            );

        });


    button.classList.add(
        "selected"
    );


    selectedFeeling = value;

}



/* =====================================================
   카테고리 선택
===================================================== */

function chooseCategory(
    button,
    value
) {

    document
        .querySelectorAll(
            "#step4 .choices button"
        )
        .forEach(function(item) {

            item.classList.remove(
                "selected"
            );

        });


    button.classList.add(
        "selected"
    );


    selectedCategory = value;

}



/* =====================================================
   MEMORY 저장
===================================================== */

async function saveMemory() {

    const memoryInput =
        document.getElementById(
            "memoryText"
        );


    const reflectionInput =
        document.getElementById(
            "reflectionText"
        );


    const memory =
        memoryInput.value.trim();


    const reflection =
        reflectionInput.value.trim();



    /*
       기억 확인
    */

    if (!memory) {

        alert(
            "첫 번째 단계에서 기억을 적어주세요."
        );

        showStep(1);

        return;

    }



    /*
       카테고리 확인
    */

    if (!selectedCategory) {

        alert(
            "기억의 카테고리를 선택해주세요."
        );

        return;

    }



    const saveButton =
        document.getElementById(
            "saveButton"
        );


    saveButton.disabled = true;

    saveButton.textContent =
        "저장 중...";



    /*
       Supabase 저장
    */

    const result =
        await supabaseClient
            .from("memories")
            .insert({

                memory:
                    memory,

                emotion:
                    selectedEmotion,

                feeling:
                    selectedFeeling,

                reflection:
                    reflection,

                category:
                    selectedCategory

            })
            .select()
            .single();



    /*
       저장 실패
    */

    if (result.error) {

        console.error(
            result.error
        );


        saveButton.disabled = false;

        saveButton.textContent =
            "기억 남기기";


        alert(
            "기억을 저장하지 못했습니다.\n\n" +
            "Supabase 설정을 확인해주세요."
        );


        return;

    }



    /*
       저장 성공
    */

    memories.unshift(
        result.data
    );


    renderMemories();



    /*
       폼 초기화
    */

    resetMemoryForm();



    alert(
        "소중한 기억이 기록되었습니다."
    );



    /*
       ARCHIVE로 이동
    */

    moveToSection(
        "archive"
    );



    saveButton.disabled = false;

    saveButton.textContent =
        "기억 남기기";

}



/* =====================================================
   폼 초기화
===================================================== */

function resetMemoryForm() {

    document.getElementById(
        "memoryText"
    ).value = "";


    document.getElementById(
        "reflectionText"
    ).value = "";


    selectedEmotion = "";

    selectedFeeling = "";

    selectedCategory = "";



    document
        .querySelectorAll(
            ".choices button"
        )
        .forEach(function(button) {

            button.classList.remove(
                "selected"
            );

        });



    showStep(1);

}



/* =====================================================
   DB에서 기억 가져오기
===================================================== */

async function loadMemories() {

    const result =
        await supabaseClient
            .from("memories")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );



    if (result.error) {

        console.error(
            result.error
        );


        document.getElementById(
            "memoryList"
        ).innerHTML = `

            <div class="empty">

                기억을 불러오지 못했어요.<br><br>

                Supabase 연결 설정을 확인해주세요.

            </div>

        `;


        return;

    }



    memories =
        result.data || [];


    renderMemories();

}



/* =====================================================
   실시간 데이터
===================================================== */

function startRealtime() {

    supabaseClient
        .channel(
            "memories-live"
        )
        .on(
            "postgres_changes",
            {
                event: "INSERT",
                schema: "public",
                table: "memories"
            },
            function(payload) {

                /*
                   이미 들어있는 기억이면
                   중복으로 추가하지 않음
                */

                const exists =
                    memories.some(
                        function(item) {

                            return (
                                item.id ===
                                payload.new.id
                            );

                        }
                    );


                if (!exists) {

                    memories.unshift(
                        payload.new
                    );


                    renderMemories();

                }

            }
        )
        .subscribe();

}



/* =====================================================
   기억 표시
===================================================== */

function renderMemories() {

    const list =
        document.getElementById(
            "memoryList"
        );


    const count =
        document.getElementById(
            "memoryCount"
        );



    /*
       필터
    */

    let filtered =
        memories;


    if (currentFilter !== "전체") {

        filtered =
            memories.filter(
                function(memory) {

                    return (
                        memory.category ===
                        currentFilter
                    );

                }
            );

    }



    /*
       개수
    */

    count.textContent =
        filtered.length;



    /*
       기억이 없을 때
    */

    if (filtered.length === 0) {

        list.innerHTML = `

            <div class="empty">

                아직 남겨진 기억이 없어요.<br><br>

                첫 번째 기억을 남겨보세요.

            </div>

        `;

        return;

    }



    /*
       기존 내용 삭제
    */

    list.innerHTML = "";



    /*
       카드 생성
    */

    filtered.forEach(
        function(memory, index) {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "memory-card";



            let html = `

                <div class="memory-number">

                    MEMORY #${String(
                        index + 1
                    ).padStart(2, "0")}

                </div>


                <h3>

                    “${escapeHTML(
                        memory.memory
                    )}”

                </h3>

            `;



            if (memory.emotion) {

                html += `

                    <div class="memory-emotion">

                        당시의 감정 ·
                        ${escapeHTML(
                            memory.emotion
                        )}

                    </div>

                `;

            }



            if (memory.feeling) {

                html += `

                    <div class="memory-emotion">

                        지금의 기분 ·
                        ${escapeHTML(
                            memory.feeling
                        )}

                    </div>

                `;

            }



            if (memory.reflection) {

                html += `

                    <div class="memory-reflection">

                        기억이 남긴 생각<br>

                        “${escapeHTML(
                            memory.reflection
                        )}”

                    </div>

                `;

            }



            html += `

                <span class="category">

                    ${escapeHTML(
                        memory.category
                    )}

                </span>

            `;



            card.innerHTML =
                html;


            list.appendChild(
                card
            );

        }
    );

}



/* =====================================================
   카테고리 필터
===================================================== */

function filterMemories(
    category,
    button
) {

    currentFilter =
        category;



    document
        .querySelectorAll(
            ".filters button"
        )
        .forEach(function(item) {

            item.classList.remove(
                "selected"
            );

        });


    button.classList.add(
        "selected"
    );


    renderMemories();

}



/* =====================================================
   HTML 보안
===================================================== */

function escapeHTML(value) {

    return String(
        value || ""
    )

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}



/* =====================================================
   공감
===================================================== */

function showEmpathy(
    message
) {

    const element =
        document.getElementById(
            "empathyMessage"
        );


    element.textContent =
        "“" +
        message +
        "” 마음이 전달되었어요.";

}



/* =====================================================
   앱 시작
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        /*
           처음에는 무조건 1단계
        */

        showStep(1);


        /*
           기억 불러오기
        */

        loadMemories();


        /*
           실시간 연결
        */

        startRealtime();

    }
);
