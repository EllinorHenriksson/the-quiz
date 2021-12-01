/**
 * The my-hello web component module.
 *
 * @author // TODO: YOUR NAME <YOUR EMAIL>
 * @version 1.1.0
 */

// Define template.
const template = document.createElement('template')
template.innerHTML = `
  <style>
    .quizApp {
      background: #9fbed3;
      padding: 1rem;
      max-width: 600px;
      margin: 50vh auto;
      transform: translateY(-50%);
      border-radius: 20px;
      border: #f8f8f8 5px dotted;
    }

    .welcome h1 {
      text-align: center;
    }

    .welcome p {
      font-weight: bold;
    }

    .welcome form {
      text-align: center;
    }

    .quizApp input {
      font-size: 16px;
      background-color: #f8f8f8;
      color: #2c3a44;  
      border: 1px solid #2c3a44;
      padding: 5px;
      cursor: pointer;
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
        <input type="submit" value="Go to quiz">
      </form>
    </div>
    <!-- 
    <div class="testOutput"></div>
    <div class="question"></div>
    -->
  </div>
`

customElements.define('my-quiz-app2',
  class extends HTMLElement { 

    #quizApp
    
    #welcome
    
    #form

    #nickname
   
    constructor () {
      super()
       
      this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))

      this.#quizApp = this.shadowRoot.querySelector('.quizApp')
      this.#welcome = this.shadowRoot.querySelector('.welcome')
      this.#form = this.shadowRoot.querySelector('.welcome form')

      this.#form.addEventListener('submit', event => {
        event.preventDefault()
        this.#handleSubmit()
      })
    }

    #handleSubmit () {
      this.#quizApp.removeChild(this.#welcome)
      const myNickname = document.createElement('my-nickname')
      this.#quizApp.appendChild(myNickname)
      this.shadowRoot.querySelector('my-nickname').addEventListener('chooseNickname', event => this.#setNickname(event.detail))
    }

    #setNickname (nickname) {
      this.#nickname = nickname
      console.log(nickname)
    }

  }
)
