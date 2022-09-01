import './style.css'
import countries from './countries.json'  //leemos los datos
import {toast} from 'https://cdn.skypack.dev/wc-toast'  //Toast import


//FUNCION PROPIA QUE OBTIENE UN SELECTOR, PARECIDO A LO QUE HACE JQUERY
const $= (selector) => document.querySelector(selector)


// HTML inputs desde la función anterior (evitamos hacer 'document.querySelector(selector)' a cada uno)

const $form = $('form');
const $input = $('input');
const $textarea = $('textarea');



//funcion para convertir la zona local en formato correcto
function changeTimeZone(date,timeZone) {
  const dateToUse = typeof date==='string' ? new Date(date) : date



  return new Date(dateToUse.toLocaleString('en-US',{timeZone})) 

}


// convierte la fecha en el formato de salida mostrado de 24H
const transformDateToString = (date) =>{
  const localDate = date.toLocaleString('es-ES',{
    hour12:false,
    hour:'numeric',
    minute:'numeric'
  })
  return localDate.replace(':00','Hrs.')
}


/* const spainInfo=countries.find(country =>country.country_code==='ES')
const argentinaInfo=countries.find(country =>country.name==='AR')
const colombiaInfo=countries.find(country =>country.name==='CO') */


$form.addEventListener('submit',(event) =>{
  event.preventDefault();
 

//data es un objeto creado gracias a fromEntries a partir de un
// array de arrays de todos los inputs del form y sus valores correspondientes
const date=$input.value
const mainDate=new Date(date)
const times={}


  //obtenemos los datos de cada country

 countries.forEach(country => {
  const {country_code:code,timezones,emoji} =country
  const [timezone] = timezones
  const dateInTimezone= changeTimeZone(mainDate,timezone)
  const hour = dateInTimezone.getHours()
  times[hour] ??= []

  times[hour].push({
    date:dateInTimezone,
    code,
    emoji,
    timezones
  })



})

//ordenar los timepos para mostrarlos ordenados
const sortedTimes=Object
  .entries(times)
  .sort(([timeA],[timeB]) => +timeB - +timeA)


const html =Object.values(times).map(countries => {
  const flags=  countries.map(country =>`${country.emoji}`).join(' ')
  const [country] = countries
  const {date}=country

  return `${flags} ${transformDateToString(date)}`
    
}).join('\n')


//copiamos en el portapapeles y mostramos el toast
    navigator.clipboard.writeText(html)
          .then(()=>{
            toast('¡ Copiado al portapapeles con éxito!',{
              icon:{
                type: 'sucess'
              },
              duration: 1000,
            theme: {
                type:  'dark'
            }})
          })

  //mostramos el resultado en el textarea
  
  $textarea.value=html 

})
