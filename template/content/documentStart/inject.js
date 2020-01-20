// 向页面注入JS
function injectCustomJs (scriptContent) {
  var temp = document.createElement('script')
  temp.setAttribute('type', 'text/javascript')
  temp.innerText = scriptContent
  document.documentElement.appendChild(temp)
  temp.onload = function () {
    if (this.parentNode) {
      this.parentNode.removeChild(this)
    }
  }
}

injectCustomJs("@{{{./static/js/documentStart.bundle.js}}}")
