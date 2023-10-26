// Get all input elements
var inputs = document.getElementsByTagName("input");

// Add event listener to each input element
for (var i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("focus", function() {
        this.removeAttribute("placeholder");
    });
}


//apis

//post User


const email = document.getElementById('email');
const password = document.getElementById('password');
const button = document.getElementById('btn');
const emailNotFound = document.getElementById('warning-message-email');
const passNotFound = document.getElementById('warning-message-pass');

let msg;

async function getLoginData(){
    const data = {
        email: email,
        password: password
    }
    const response = await axios.post(`http://localhost:3000/getLogin`, data);
    response = response.text();
    msg = response;
    if(msg === 'Email Not Found'){
        emailNotFound.classList.add('show');
    }else if(msg === 'Pass Not Found'){
        passNotFound.classList.add('show');
    }else{
        console.log('Logged In Successfully');
    }
}


button.addEventListener('click', getLoginData);