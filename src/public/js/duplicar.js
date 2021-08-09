const duplicatorContainer = document.getElementById("duplicar")
const rowToDuplicate = duplicatorContainer.querySelector(".row")
const select = duplicatorContainer.querySelector("select")
const input = duplicatorContainer.querySelector("#cantidad")
const button = rowToDuplicate.querySelector('button')
button.addEventListener('click', duplicator)
select.addEventListener('change', updateValues)
input.addEventListener('change', updateValues)

function duplicator () {
  const clone = rowToDuplicate.cloneNode(true)
  const button = clone.querySelector('button')
  const select = clone.querySelector("select")
  const input = clone.querySelector("#cantidad")
  select.addEventListener('change', updateValues)
  input.addEventListener('change', updateValues)
  button.addEventListener('click', duplicator)
  duplicatorContainer.appendChild(clone)
}
function updateValues (){
 const values= calcularValues()
printValues(values)
}
function getPriceBySelect(select){
  const idProducto= select.value
  if(idProducto){
    const options= [...select.children]
    const optionSelected = options.find((option)=>option.value===idProducto)
    const price= optionSelected.dataset.price
    return Number(price)
    
  }
  return 0
}
function calcularValues(){
  const rows = [...duplicatorContainer.querySelectorAll(".row")]
  const neto = rows.reduce((sum, row)=>{
    const select = row.querySelector("select")
    const input = row.querySelector("#cantidad")
    const price = getPriceBySelect(select)
    const quantity= Number(input.value) 
    console.log(quantity, price)
    const multiplication = price * quantity
    return sum + multiplication
  },0)
  const total= 1.19 * neto
  return{neto, total}
}

function printValues({neto, total}){
  const elementoNeto = document.getElementById("elementValorNeto")
  const elementoTotal = document.getElementById("elementValorTotal")
  elementoNeto.value= neto
  elementoTotal.value= total

}





//ejecutar el amacenamiento de compra 
// valor_bruto: valor_bruto,
// total: total,
// fecha_venta: fecha_venta,
// cedula_cliente: cedula_cliente
const form = document.getElementById("registerP")
form.addEventListener("submit",(e)=>{
  e.preventDefault()
  const rows = [...form.querySelectorAll(".row")]
  const productos = rows.map((row)=>{
    const select = row.querySelector("select")
    const codigoProducto = Number(select.value)
    const cantidad = Number(row.querySelector("#cantidad").value)
    const price = getPriceBySelect(select)
    const valor_bruto = price * cantidad
    const total = valor_bruto * 1.19
    return[
   codigoProducto,
   cantidad,
   valor_bruto,
   total
    ]
  })
  const valorNeto = document.getElementById("elementValorNeto").value
  const total = document.getElementById("elementValorTotal").value
  const fechaFactura = document.getElementById("fechaVenta").value
  const cedula_cliente = document.getElementById("cedulaCliente").value
  const nombre_cliente = document.getElementById("nombreCliente").value
  const direccion = document.getElementById("direccionCliente").value
  const numero_celular = document.getElementById("celularCliente").value
  
  const data = {productos, total, valorNeto, fechaFactura, cedula_cliente, nombre_cliente, direccion, numero_celular}
  fetch("/registrarSalida", {
    method:"POST",
    body: JSON.stringify(data), 
    headers: {
      "Content-Type":"application/json"
    }
  }).then(res=>res.json())
  .then((res)=>{
  if (res.success){
    Swal.fire({
      title: 'Registrar venta exitosa',
      text: 'el registro de la venta se a realizado de forma exitosa',
      icon: 'success',
      showConfirmButton: false,
      timer: 3000
  }).then(()=>{
      window.location='/'
  })
  }    
  })
})
