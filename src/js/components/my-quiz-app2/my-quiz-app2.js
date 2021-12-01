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
      /*padding: 15px;
      border-radius: 20px;
      font-size: 16px;
      font-weight: bold;
      border: 0px;
      background-color: #f8f8f8;
      color: #2c3a44;
      cursor: pointer;
      box-shadow: 5px 5px 15px #2c3a44;  */
      font-size: 16px;
      background-color: #f8f8f8;
      color: #2c3a44;  
      border: 1px solid #2c3a44;
      padding: 5px;
      cursor: pointer;
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
        <input type="submit" value="Go to quiz">
      </form>
    </div>
    <div class="nicknameContainer hidden">
      <p>Choose a nickname, then start the quiz!</p>
      <my-nickname></my-nickname>
    </div>
    <!-- 
    <div class="testOutput"></div>
    <div class="question"></div>
    -->
  </div>
`

customElements.define('my-quiz-app2',
  class extends HTMLElement { 

    #welcome
    
    #form

    #nicknameContainer

    #myNickname

    #nickname
   
    constructor () {
      super()
       
      this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))

      this.#welcome = this.shadowRoot.querySelector('.welcome')
      this.#form = this.shadowRoot.querySelector('.welcome form')
      this.#nicknameContainer = this.shadowRoot.querySelector('.nicknameContainer')
      this.#myNickname = this.shadowRoot.querySelector('my-nickname')

      this.#form.addEventListener('submit', event => {
        event.preventDefault()
        this.#handleSubmit()
      })

      this.#myNickname.addEventListener('chooseNickname', event => this.#setNickname(event.detail))
    }

    #handleSubmit () {
      this.#welcome.classList.add('hidden')
      this.#nicknameContainer.classList.toggle('hidden')
    }

    #setNickname (nickname) {
      this.#nickname = nickname
    }

  }
)
