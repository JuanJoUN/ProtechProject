const testContainer = document.getElementById("duplicar")
const rowToDuplicate = testContainer.querySelector(".row")
const button = rowToDuplicate.querySelector('button')
button.addEventListener('click', duplicator)

function duplicator () {
  const clone = rowToDuplicate.cloneNode(true)
  const button = clone.querySelector('button')
  button.addEventListener('click', duplicator)
  testContainer.appendChild(clone)
}