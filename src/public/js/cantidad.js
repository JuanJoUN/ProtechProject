const input  = document.getElementById("cantidad")
const select = document.getElementById("select-p")

select.addEventListener('change', e => {
  const value = e.target.value
  const option = select.querySelector(`option[value="${value}"]`)
  const stock = option.dataset.stock
  console.log(stock)
  input.setAttribute("max", stock)
})