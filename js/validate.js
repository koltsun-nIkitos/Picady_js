const validator =(form)=>{
    let result = true;
    
    const inputs = form.querySelectorAll('input');

    inputs.forEach(input => {
        if (input.value==''){
            console.log('Ошибка поля!');
            result = false;
        }
        console.log(input);
    });

    return result;
}



export default validator