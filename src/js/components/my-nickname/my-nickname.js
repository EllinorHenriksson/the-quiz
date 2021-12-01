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

  input[type="submit"] {
    cursor: pointer;
  }
</style>

<form>
  <input type="text">
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
        event.stopPropagation()

        this.#handleSubmit()
      })
    
    }

    #handleSubmit () {
      const chooseNicknameEvent = new window.CustomEvent('chooseNickname', { detail: this.#nickname.value})
      this.dispatchEvent(chooseNicknameEvent)
    }

  })

