const altura = document.body.scrollHeight - window.innerHeight;
const fondo = document.getElementById('fondo');
const inputsLogIn = document.querySelectorAll('#FormularioLogIn input');
const inputsRegister = document.querySelectorAll('#FormularioRegistro input');

window.onscroll = () => {
	const anchoFondo = (window.pageYOffset / altura) * 700;
	if (anchoFondo <= 100) {
		fondo.style.width = anchoFondo + '%';
	}
}
function accion() {
	const ancla = document.getElementsByClassName("menu_a");
	for (let i = 0; i < ancla.length; i++) {
		ancla[i].classList.toggle("desaparece")
	}
}
 const expReg = {
	 correo: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/,
	 contraseña: /^.{6,20}$/,
	 usuario: /^([a-zA-Z]{3,10}\s?)+$/,
	 celular: /^[0-9]{10}$/
 }


 const validacionesForm = (e) =>{
	switch (e.target.name){
		case "correo":
			validar(expReg.correo, e.target, 'Correo');
			break;
		case "nombre":
			validar(expReg.usuario, e.target, 'Nombre');
			break;
		case "apellido":
			validar(expReg.usuario, e.target, 'Apellido');
			break;
		case "celular":
			validar(expReg.celular, e.target, 'Telefono');
			break;
		case "contraseñaRegistro":
			validar(expReg.contraseña, e.target, 'ContrasenaRegistro');
			break;
	}

}


const validar = (expresion, input, campo) => {
	if (expresion.test(input.value)){
		console.log("Funciona");
		document.getElementById(`error${campo}`).classList.remove('showError'); //Aquí está el error
		document.getElementById(`error${campo}`).classList.add('hideError');
	}else{
		document.getElementById(`error${campo}`).classList.add('showError');
		document.getElementById(`error${campo}`).classList.remove('hideError');
	}
}

inputsLogIn.forEach((input)=>{
	input.addEventListener('keyup', validacionesForm);
	input.addEventListener('blur', validacionesForm);
})

inputsRegister.forEach((input)=>{
	input.addEventListener('keyup', validacionesForm);
	input.addEventListener('blur', validacionesForm);
})

function validarCorreo(){
	let correo = document.getElementById('correoLogIn').value;
	let expReg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
	(!expReg.test(correo))?desplegarError():"";

}

function validarNombreUsuario(){
	let nombre = document.getElementById('allElements').querySelector('.nombreUsuario');
	let expReg = /^([a-zA-Z]{3,10}\s?)+$/;
	(!expReg.test(nombre))?desplegarError():"";
}

function desplegarError(){
	document.getElementById('txtCorreoLogIn').style.display ="block";
}
