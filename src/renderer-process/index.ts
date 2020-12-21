import './style.scss'

import { getFormData, reportValidaty, addListerforError } from './form'

const submitbtn = document.querySelector('button')
const form = document.querySelector('form') as HTMLFormElement
    
submitbtn?.addEventListener('click',(event: Event)=> {
    event.preventDefault()
    const form = document.querySelector('form')
    if (! form?.checkValidity() ){
        reportValidaty(form!)
    } else {
        const data = getFormData(form!)
        console.log(data)
    }
})

addListerforError(form!)

console.log('helloo There ')
