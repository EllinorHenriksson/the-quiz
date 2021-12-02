const template = document.createElement('template')
template.innerHTML = `
<style>
    div {
        position: relative;
        width: 100%;
        height: 100%;
        background-color: red;
    }

    p {
        position: absolute;

    }
</style>
<div>
  <p>My timer</p>
</div>
`

customElements.define('my-timer',
  class extends HTMLElement {

    constructor () {
      super()

      this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))
    }
})
