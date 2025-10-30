let questions = [], current = 0, answers = [];

document.getElementById("startBtn").addEventListener("click", startQuiz);
document.getElementById("nextBtn").addEventListener("click", nextQuestion);
document.getElementById("submitBtn").addEventListener("click", submitQuiz);

function startQuiz() {
  const unit = document.getElementById("unit").value;
  const part = document.getElementById("part").value;
  const type = document.getElementById("type").value;
  const num = parseInt(document.getElementById("num").value);

  fetch("questions.json")
    .then(r => r.json())
    .then(data => {
      questions = data.QBank.filter(q => q.Unit === unit && q.Part === part && q.Type === type);
      questions = questions.sort(() => 0.5 - Math.random()).slice(0, num);
      current = 0;
      answers = Array(questions.length).fill(null);
      if (questions.length === 0) {
        document.getElementById("quiz").innerHTML = "<p>No questions found.</p>";
        document.getElementById("nextBtn").style.display = "none";
        document.getElementById("submitBtn").style.display = "none";
        return;
      }
      showQuestion();
      document.getElementById("nextBtn").style.display = "inline-block";
      document.getElementById("submitBtn").style.display = "inline-block";
    })
    .catch(e => {
      console.error(e);
      document.getElementById("quiz").innerHTML = "<p>Error loading questions.</p>";
    });
}

function showQuestion() {
  const q = questions[current];
  let html = `<div class="question"><h3>Q${current+1}: ${q.Question}</h3>`;
  if (q.Type === "MCQ") {
    for (let i=1;i<=4;i++){
      if(q["Option"+i]){
        html += `<label><input type="radio" name="q${current}" value="${i}" ${answers[current]==i?'checked':''}> ${q["Option"+i]}</label><br>`;
      }
    }
  } else if(q.Type === "TF") {
    html += `<label><input type="radio" name="q${current}" value="1" ${answers[current]==1?'checked':''}> True</label><br>`;
    html += `<label><input type="radio" name="q${current}" value="2" ${answers[current]==2?'checked':''}> False</label><br>`;
  }
  html += "</div>";
  document.getElementById("quiz").innerHTML = html;
}

function nextQuestion() {
  saveAnswer();
  if(current < questions.length-1) {
    current++;
    showQuestion();
  } else {
    alert("This is the last question.");
  }
}

function saveAnswer() {
  const selected = document.querySelector(`input[name="q${current}"]:checked`);
  if(selected) answers[current] = parseInt(selected.value);
}

function submitQuiz() {
  saveAnswer();
  let score = 0;
  questions.forEach((q,i)=>{
    if(answers[i] === q.CorrectAnswer) score += q.Score;
  });
  document.getElementById("score").innerHTML = `<h3>Your Score: ${score} / ${questions.reduce((a,b)=>a+b.Score,0)}</h3>`;
}
