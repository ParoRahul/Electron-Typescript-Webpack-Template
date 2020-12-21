
export const getFormData = (form: HTMLFormElement): { [prop:string]: string} => {
    // const inputs = form.querySelectorAll('input');
    const values: { [prop:string]: string} = {}
    form.querySelectorAll('input').forEach( (element: HTMLInputElement)=>{
        values[element.id] = element.value
        console.log('hi')
    })
    return values
}

export const reportValidaty = (form: HTMLFormElement): void => {
    form.querySelectorAll('input').forEach( (element: HTMLInputElement)=>{
        if ( !element.checkValidity() ) {
            element.classList.add('error')
            element.classList.remove('mb-4')
            console.dir(element.validationMessage)
            if (element.nextElementSibling)
                element.nextElementSibling.innerHTML = `<small>${element.validationMessage}</small>`
        }
    })
}

export const addListerforError = ( form: HTMLFormElement ): void => {
    form.querySelectorAll('input').forEach( (element: HTMLInputElement )=>{
       element.addEventListener('input',(_event)=>{           
        element.classList.remove('error')
        element.classList.add('mb-4')
        if (element.nextElementSibling)
            element.nextElementSibling.innerHTML = ''
        })
    })
}