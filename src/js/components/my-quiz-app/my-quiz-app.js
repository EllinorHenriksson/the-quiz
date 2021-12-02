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
      .hidden {
          display: none;
      }
  </style>
  <div class="quizApp">
      <h1>Hello World!</h1>
      <form>
          <input type="text">
          <input type="submit" value="Click">
      </form>
      <div class="testOutput"></div>
      <div class="question"></div>
  </div>
`

customElements.define('my-quiz-app',
  /**
   * Represents a my-hello element.
   */
  class extends HTMLElement {
    /**
     * The bulletin board element.
     *
     * @type {HTMLDivElement}
     */
     #quizApp

     #form

     /**
      * Creates an instance of the current type.
      */
     constructor () {
       super()

       // Attach a shadow DOM tree to this element and
       // append the template to the shadow root.
       this.attachShadow({ mode: 'open' })
         .appendChild(template.content.cloneNode(true))

       // Get the bulletin board element in the shadow root.
       this.#quizApp = this.shadowRoot.querySelector('.quizApp')

       this.#form = this.shadowRoot.querySelector('form')

       this.handleSubmit = this.handleSubmit.bind(this)
     
       this.#form.addEventListener('submit', this.handleSubmit)
     }

    handleSubmit (event) {
       event.preventDefault()

       const nickname = this.shadowRoot.querySelector('input[type="text"]').value
       
       const pTag = document.createElement('p')
       pTag.innerText = nickname

       this.shadowRoot.querySelector('.testOutput').appendChild(pTag)

       this.#form.classList.add('hidden')

       this.#showQuestions()
     }

     #showQuestions () {
        const url = 'https://courselab.lnu.se/quiz/question/1'
        const question = document.createElement('my-question')
        this.shadowRoot.querySelector('.question').appendChild(question)
        const myQuestion = this.shadowRoot.querySelector('my-question')
        myQuestion.presentQuestion(url)
     }
     /**
      * Called after the element is inserted into the DOM.
      */
     connectedCallback () {
     }

       /**
        * Called after the element has been removed from the DOM.
        */
       disconnectedCallback () {
       }
  }
)
