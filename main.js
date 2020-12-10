const xhr = new XMLHttpRequest;
const cate_form = document.querySelector(".category_selection")
const question_box = document.querySelector(".question-box")
const question = document.createElement("div")
question.classList.add("question")
const answers = document.createElement("div")
answers.classList.add("answers")
const nextBtn = document.createElement("button")
nextBtn.innerHTML = "Start"
nextBtn.type = "submit"
const q_head = document.querySelector("header")
result = document.querySelector(".result")
var q_count = 0
right = 0
wrong = 0
xhr.responseType = 'json';
xhr.open("GET", "https://opentdb.com/api_category.php")
xhr.send()
xhr.onload = ()=>{
    resp = xhr.response.trivia_categories
    list = document.createElement('select')
    resp.forEach(el => {
        cate = document.createElement("option")
        cate.innerHTML = el.name
        cate.value = el.id
        list.append(cate)
    });
    cate_form.innerHTML = ""
    cate_form.appendChild(list)
    cate_form.appendChild(nextBtn)
}

cate_form.addEventListener("submit", (e) => {
    nextBtn.innerHTML = "Next"
    e.preventDefault()
    cate_form.style.display = "none"
    question_box.style.display = "flex"
    xhr.open("GET", "https://opentdb.com/api.php?amount=10&category=" + list.value)
    xhr.send()
    question_box.innerHTML = "<div class=\"loading\">Loading</div>"
    xhr.onload = function () {
        resp = xhr.response
        if (resp.response_code == 0){
            q_list = resp.results
            newQuestion(q_count)
        }
    }
})

function newQuestion(q_count) {
    question_box.innerHTML = ""
    q = q_list[q_count]
    q_head.children[0].innerHTML = "Question " + (q_count + 1)
    q_head.children[1].innerHTML = right + "/" + q_list.length 
    question.innerHTML = q.question
    answers.innerHTML = ""
    choices = q.incorrect_answers            
    choices.push(q.correct_answer)
    shuffle(choices)
    choices.forEach((choice) => {
        choice_el = document.createElement("div")
        choice_el.innerHTML = choice
        choice_el.onclick = checkAnswer
        answers.appendChild(choice_el)
    })
    if (q_count == q_list.length - 1) {
        nextBtn.innerHTML = "Finish"
    }
    question_box.appendChild(question)
    question_box.appendChild(answers)
    nextBtn.disabled = true
    question_box.appendChild(nextBtn)
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

question_box.addEventListener("submit", (e)=>{
    e.preventDefault()
    if (q_count < q_list.length - 1) {
        q_count += 1
        answers.style.pointerEvents = "all"
        newQuestion(q_count)
    }
    else {
        question_box.style.display = "none"
        q_head.children[0].innerHTML = "Result"
        q_head.children[1].innerHTML = ""
        result.innerHTML = "Right Answers: " + right + "<br>Wrong Answers: " + wrong + "<br>"
        if (right > wrong) {
            result.innerHTML += "You Pro"
        }
        else if (right == wrong) {
            result.innerHTML += "Hmmm...."
        }
        else{
            result.innerHTML += "You nub"
        }
        result.innerHTML += "<br><br><button onclick=\"window.location.reload(false);\"> Play again </button>"
    }
})

function checkAnswer() {
    if (this.innerHTML == q.correct_answer){
        this.style.backgroundColor = "green"
        right += 1
    }
    else {
        this.style.backgroundColor = "red"
        wrong += 1
    }
    nextBtn.disabled = false
    answers.style.pointerEvents = "none"
}