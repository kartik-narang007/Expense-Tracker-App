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
// email.addEventListener('input', validateEmail);

// const validateEmail = async()=>{

//     const emailValue = email.value;

//     try{

//     }catch(err){

//     }

// }
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

// const validateEmail = (e)=>{
    
// }

form.addEventListener('submit', submit);