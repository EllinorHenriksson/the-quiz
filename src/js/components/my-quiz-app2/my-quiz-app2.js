/**
 * The my-hello web component module.
 *
 * @author // TODO: YOUR NAME <YOUR EMAIL>
 * @version 1.1.0
 */

import '../my-nickname'
import '../my-question2'
import '../my-timer'
import '../my-high-score'

// Define template.
const template = document.createElement('template')
template.innerHTML = `
  <style>
    .quizApp {
      background-color: #9fbed3;
      padding: 1rem;
      max-width: 600px;
      margin: 50vh auto;
      transform: translateY(-50%);
      border-radius: 20px;
      border: #f8f8f8 5px dotted;
    }

    h1 {
      text-align: center;
    }

    p {
      font-weight: bold;
    }

    form {
      text-align: center;
    }

    input {
      font-size: 16px;
      background-color: #f8f8f8;
      color: #2c3a44;  
      border: 1px solid #2c3a44;
      padding: 5px;
      cursor: pointer;
    }

    input:focus {
    border: 2px solid #2c3a44;
    background-color: #f0eb89;
    }

    input:hover {
      transform: translate(1px, 1px);
    }

    .question {
      display: grid;
      grid-template-columns: auto min-content;
    }

    .networkError, .statusNotOK, #endDisplay {
      text-align: center;
    }

    #endDisplay form {
      margin-top: 15px;
    }

    .hidden {
      display: none;
    }
  </style>

  <div class="quizApp">
    <div class="welcome">
      <h1>Welcome to the quiz app!</h1>
      <h2>Rules:</h2>
      <ul>
        <li>Answer the question and click the submit button before the time is up.</li>
        <li>Some answers have multiple answer alternatives, choose only one.</li>
        <li>If the time runs out or your answer is wrong, the game is over. Otherwise you'll be presented with a new question.</li>
        <li>At the end of the game you'll see a high score with the five quickest quiz participants that answered all questions correctly.</li>
      </ul>
      <p>Good luck!</p>
      <form>
        <input type="submit" value="Go to quiz" autofocus>
      </form>
    </div>
    <my-nickname class="hidden"></my-nickname>
    <div class="question hidden">
      <my-question2></my-question2>
      <my-timer></my-timer>
    </div>
    <div id="endDisplay">
      <div class="completeQuiz hidden">
        <p>Yay, you completed the quiz!</p>
      </div>
      <div class="wrongAnswer hidden">
        <p>Wrong answer - Game over!</p>
      </div>
      <div class="timeout hidden">
        <p>You ran out of time - Game over!</p>
      </div>
      <div class="highScore hidden">
          <h3>High Score</h3>
          <my-high-score length="5"></my-high-score>
          <form>
            <input type="submit" value="Play again">
          </form> 
        </div>
    </div>
    <div class="statusNotOK hidden">
      <h2>Bad Status</h2>
      <p>Oops! Something went wrong.</p>
      <p>Try to reload the page.</p>
    </div>
    <div class="networkError hidden">
      <h2>Network Error</h2>
      <p>Oops! Something went wrong.</p>
      <p>Try to reload the page.</p>
    </div>
  </div>
`

customElements.define('my-quiz-app2',
  class extends HTMLElement { 

    #welcome

    #welcomeForm

    #myNickname

    #question

    #myQuestion

    #myTimer

    #completeQuiz

    #wrongAnswer

    #timeout

    #highScore

    #myHighScore

    #nickname

    #startTime

    #stopTime

    #totalTime

    constructor () {
      super()

      this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))

      this.#welcome = this.shadowRoot.querySelector('.welcome')
      this.#welcomeForm = this.shadowRoot.querySelector('.welcome form')
      this.#myNickname = this.shadowRoot.querySelector('my-nickname')
      this.#myQuestion = this.shadowRoot.querySelector('my-question2')
      this.#question = this.shadowRoot.querySelector('.question')
      this.#myTimer = this.shadowRoot.querySelector('my-timer')
      this.#completeQuiz = this.shadowRoot.querySelector('.completeQuiz')
      this.#wrongAnswer = this.shadowRoot.querySelector('.wrongAnswer')
      this.#timeout = this.shadowRoot.querySelector('.timeout')
      this.#highScore = this.shadowRoot.querySelector('.highScore')
      this.#myHighScore = this.shadowRoot.querySelector('my-high-score')

      this.#welcomeForm.addEventListener('submit', event => {
        event.preventDefault()
        event.stopPropagation()
        this.#handleSubmit()
      })

      this.#myNickname.addEventListener('startQuiz', event => this.#handleStartQuiz(event))
      this.#myQuestion.addEventListener('completeQuiz', event => this.#handleCompleteQuiz(event))
      this.#myQuestion.addEventListener('wrongAnswer', event => this.#handleWrongAnswer())
      this.#myQuestion.addEventListener('statusNotOK', event => this.#handleStatusNotOK())
      this.#myTimer.addEventListener('timeout', event => this.#handleTimeout())
      this.#myQuestion.addEventListener('myQuestionSubmit', event => this.#handleMyQuestionSubmit())
      this.#myQuestion.addEventListener('questionPresented', event => this.#handleQuestionPresented(event))
      this.#myQuestion.addEventListener('networkError', event => this.#handleNetworkError())

      this.#highScore.querySelector('form').addEventListener('submit', event => {
        event.preventDefault()
        this.#handlePlayAgainSubmit()
      })
    }

    #handleSubmit () {
      this.#switchContent(this.#welcome, this.#myNickname)
    }

    #switchContent (toHide, toShow) {
      toHide.classList.toggle('hidden')
      toShow.classList.toggle('hidden')

      if (toShow === this.#myNickname) {
        this.#myNickname.setAttribute('active', '')
      } else if (toShow === this.#completeQuiz || toShow === this.#wrongAnswer || toShow === this.#timeout) {
        this.#highScore.classList.toggle('hidden')
        this.#highScore.querySelector('input').focus()
      }
    }

    #handleStartQuiz (event) {
      this.#nickname = event.detail.nickname
      this.#startTime = event.timeStamp

      this.#switchContent(this.#myNickname, this.#question)

      this.#myQuestion.nextQuestion()
    }

    #handleCompleteQuiz (event) {
      this.#stopTime = event.timeStamp
      this.#totalTime = Math.round((this.#stopTime - this.#startTime) / 1000)
      this.#myHighScore.saveResult({ nickname: this.#nickname, totalTime: this.#totalTime })

      this.#switchContent(this.#question, this.#completeQuiz)
    }

    #handleWrongAnswer () {
      this.#switchContent(this.#question, this.#wrongAnswer)
    }

    #handleTimeout () {
      this.#myQuestion.clearWindow()
      this.#switchContent(this.#question, this.#timeout)
    }

    #handleMyQuestionSubmit () {
      this.#myTimer.stopTimer()
    }

    #handleQuestionPresented (event) {
      this.#myTimer.setAttribute('limit', event.detail.limit)
      this.#myTimer.startTimer()
    }

    #handleStatusNotOK () {
      this.#switchContent(this.#question, this.shadowRoot.querySelector('.statusNotOK'))
    }

    #handleNetworkError () {
      this.#switchContent(this.#question, this.shadowRoot.querySelector('.networkError'))
    }

    #handlePlayAgainSubmit () {
      if (!this.#completeQuiz.getAttribute('class').includes('hidden')) {
        this.#switchContent(this.#completeQuiz, this.#myNickname)
      } else if (!this.#wrongAnswer.getAttribute('class').includes('hidden')) {
        this.#switchContent(this.#wrongAnswer, this.#myNickname)
      } else if (!this.#timeout.getAttribute('class').includes('hidden')) {
        this.#switchContent(this.#timeout, this.#myNickname)
      }

      this.#highScore.classList.toggle('hidden')
    }
  }
)
