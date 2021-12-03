/**
 * The my-nickname web component module.
 *
 * @author Ellinor Henriksson <eh224kr@student.lnu.se>
 * @version 1.1.0
 */

const template = document.createElement('template')
template.innerHTML = `
<style>
  input {
    font-size: 16px;
    background-color: #f8f8f8;
    color: #2c3a44;  
    border: 1px solid #2c3a44;
    padding: 5px;
  }

  input:focus {
    border: 2px solid #2c3a44;
    background-color: #f0eb89;
  }

  input[type="submit"] {
    cursor: pointer;
  }

  input[type="submit"]:hover {
    transform: translate(1px, 1px);
  }
</style>

<p>Choose a nickname, then start the quiz!</p>
<form>
  <input type="text" placeholder="Nickname">
  <input type="submit" value="Start">
</form>
`

customElements.define('my-nickname',
  class extends HTMLElement {

    #form
    
    #nickname
    
    constructor () {
      super()

      this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))

      this.#form = this.shadowRoot.querySelector('form')
      this.#nickname = this.shadowRoot.querySelector('input[type="text"]')

      this.#form.addEventListener('submit', event => {
        event.preventDefault()
        this.#handleSubmit()
      })
    
    }

    static get observedAttributes () {
      return ['active']
    }

    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'active' && newValue !== oldValue) {
        this.#nickname.focus()
      }
    }

    #handleSubmit () {
      this.dispatchEvent(new window.CustomEvent('startQuiz', { detail: { nickname: this.#nickname.value }}))
    }

  })

