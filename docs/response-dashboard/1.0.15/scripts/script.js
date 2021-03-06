/* global document, prettyPrint */

(function() {
  let source
  let i = 0
  let lineNumber = 0
  let lineId
  let lines
  let totalLines
  let anchorHash
  const navTrigger = document.querySelector('#nav-trigger')

  prettyPrint()

  source = document.getElementsByClassName('prettyprint source linenums')

  if (source && source[0]) {
    anchorHash = document.location.hash.substring(1)
    lines = source[0].getElementsByTagName('li')
    totalLines = lines.length

    for (; i < totalLines; i++) {
      lineNumber++
      lineId = 'line' + lineNumber
      lines[i].id = lineId

      if (lineId === anchorHash) {
        lines[i].className += ' selected'
      }
    }
  }

  // Closes mobile nav on item click
  document.querySelectorAll('nav ul > li > a').forEach(function(el) {
    el.onclick = function(evt) {
      if (navTrigger.checked) {
        navTrigger.checked = false
      }
    }
  })
})()
