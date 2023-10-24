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

const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const button = document.getElementById('btn');
const form = document.getElementById('form');
const warningMessage = document.getElementById('warning-message');



const submit = async (e) =>{
    e.preventDefault();
    console.log('button clicked');
    const mydata = {
        name: username.value,
        email: email.value,
        password: password.value
    }
    try{
        console.log(mydata);
        const response = await axios.post("http://localhost:3000/user-signup",mydata);
        
    }catch(err){
        console.log(err);
    }
    

}

let debounceTimer;
let counter = 0;


const validateEmail = async () => {
    console.log(counter++);
    const emailValue = email.value;
    if(emailValue.trim() !== ''){
        try {
            const response = await axios.get(`http://localhost:3000/validate-email/${emailValue}`);
            const { available } = response.data;
            if (available) {
                warningMessage.classList.add('show'); // Add the 'show' class to display the warning message
            } else {
                warningMessage.classList.remove('show'); // Remove the 'show' class to hide the warning message
            }
        } catch (error) {
            console.error(error);
        }
    }else{
        warningMessage.classList.remove('show');
    }
}

email.addEventListener('input', ()=>{
    clearTimeout(debounceTimer);
    debounceTimer = (setTimeout(validateEmail,300));
})

form.addEventListener('submit', submit);