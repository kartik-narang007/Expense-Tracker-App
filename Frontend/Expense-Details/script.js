const categoryItems = document.querySelectorAll('.dropdown-item');
const categoryInput = document.querySelector('#categoryInput');
const categoryBtn = document.querySelector('#categoryBtn');
const form = document.getElementById('form1');
const addExpenseBtn = document.getElementById('submitBtn');
const table = document.getElementById('tbodyId');
const buyPremiumBtn = document.getElementById("rzp-button1");
const reportsLink = document.getElementById("reportsLink");
const leaderboardLink = document.getElementById("leaderboardLink");
//added category selection in dropdown menu and storing selected category

categoryItems.forEach((item)=>{
    item.addEventListener('click', (e)=>{
        const selectedCategory = e.target.getAttribute('data-value');
        categoryBtn.textContent = selectedCategory;
        categoryInput.value = selectedCategory;
    });
});

async function addExpense(){
    try{
        const category = document.getElementById('categoryBtn');
        const description = document.getElementById('descriptionValue');
        const amount = document.getElementById('amountValue');
        const categoryValue = category.textContent.trim();
        const descriptionValue = description.value.trim();
        const amountValue = amount.value.trim();
        
        if(categoryValue == "Select Category"){
            alert('Select the Category!');
            window.location.href('/index.html');
        }
        if(!descriptionValue){
            alert('Please Add Description!');
            window.location.href('/index.html');
        }
        if(!amountValue){
            alert('Please Add Amount!');
            window.location.href('/index.html');
        }
        
        //adding date in the table

        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();

        //adding leading zeros to day and month if needed

        const formattedDay = day < 10 ? `0${day}` : day;
        const formattedMonth = month < 10 ? `0${month}` : month;

        const dateStr = `${formattedDay}-${formattedMonth}-${year}`;

        console.log(dateStr);

        //storing it in database
        const token = localStorage.getItem("token");
        const res = await axios.post("http://localhost:3000/addExpense",{
            date: dateStr,
            category: categoryValue,
            description: descriptionValue,
            amount: parseInt(amountValue),
            // userId: req.user.id
        },{headers: {Authorization: token}}).then((res)=>{
            if(res.status == 200){
                window.location.reload();
            }
        }).catch((err)=>{
            console.log(err);
        })

    }
    catch(err){
        console.error(err);
    }
}

addExpenseBtn.addEventListener('click', addExpense);

async function getAllExpenses() {
    console.log("function called");
    try {
      const token = localStorage.getItem("token");
      console.log(token);
      const res = await axios.get(`http://localhost:3000/getAllExpenses`, {headers : {Authorization: token}});
      const table = document.getElementById("tbodyId");
      console.log(res.data);
  
      let html = "";
  
      res.data.forEach((expenses) => {
        const id = expenses.id;
        const date = expenses.date;
        const categoryValue = expenses.category;
        const descriptionValue = expenses.description;
        const amountValue = expenses.amount;
  
        html += `
          <tr class="trStyle">
            <th scope="row" style="display: none">${id}</th>
            <th scope="row">${date}</th>
            <td>${categoryValue}</td>
            <td>${descriptionValue}</td>
            <td>${amountValue}</td>
            <td>
              <button class="editDelete btn btn-danger delete">Delete</button>
              <button class="editDelete btn btn-success edit">Edit</button>
            </td>
          </tr>
        `;
      });
  
      table.insertAdjacentHTML("beforeend", html);
  
    }catch (err) {
      console.log(err);
    }
}



async function deleteExpense(e) {
    try{
        const token = localStorage.getItem('token');
        if(e.target.classList.contains('delete')){
            let tr = e.target.parentElement.parentElement;
            let id = tr.children[0].textContent;
            const res = await axios.get(`http://localhost:3000/deleteExpense/${id}`, { headers: { Authorization: token }});
            window.location.reload();
        }
    }catch(err){
        console.log(err);
    }
}


async function editExpense(e) {
    try {
      const token = localStorage.getItem('token');
      const categoryValue = document.getElementById("categoryBtn");
      const descriptionValue = document.getElementById("descriptionValue");
      const amountValue = document.getElementById("amountValue");
      const addExpenseBtn = document.getElementById("submitBtn");
      if (e.target.classList.contains("edit")) {
        let tr = e.target.parentElement.parentElement;
        let id = tr.children[0].textContent;
        //Fill the input values with the existing values
        const res = await axios.get(
          "http://localhost:3000/getAllExpenses",{ headers: { Authorization: token } }
        );
        res.data.forEach((expense) => {
        console.log(res.data);
          if (expense.id == id) {
            console.log("Yeh id aayi hai res main: " + expense.id);
            categoryValue.textContent = expense.category;
            descriptionValue.value = expense.description;
            amountValue.value = expense.amount;
            addExpenseBtn.textContent = "Update";
  
            // const form = document.getElementById("form1");
            addExpenseBtn.removeEventListener("click", addExpense);
  
            addExpenseBtn.addEventListener("click", async function update(e) {
              e.preventDefault();
              console.log("request to backend for edit");
              const res = await axios.post(
                `http://localhost:3000/editExpense/${id}`,
                {
                  category: categoryValue.textContent.trim(),
                  description: descriptionValue.value,
                  amount: amountValue.value,
                },
                { headers: { Authorization: token } }
              );
              window.location.reload();
            });
          }
        });
      }
    } catch {
      (err) => console.log(err);
    }
  }

table.addEventListener('click', (e)=>{
    deleteExpense(e);
})

table.addEventListener('click', (e)=>{
    editExpense(e);
})


async function buyPremium(e){
  const token = localStorage.getItem('token');
  const response = await axios.get('http://localhost:3000/purchase/premiummembership', {headers:{"Authorization": token}});
  console.log(response);
  var options = {
    key: response.data.key_id,
    order_id: response.data.order.id,
    handler: async function(response){
      console.log(localStorage.getItem("token"));
      const res = await axios.post('http://localhost:3000/purchase/updatetransactionstatus', {
        order_id: options.order_id,
        payment_id: response.razorpay_payment_id,
      },  { headers: {Authorization: token} })
      alert('You are a premium user now');
      console.log(res);
      localStorage.setItem("token", res.data.token);
      window.location.reload()
    }
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();
};


async function isPremiumUser() {
  const token = localStorage.getItem("token");
  const res = await axios.get("http://localhost:3000/isPremiumUser", {
    headers: { Authorization: token },
  });
  if (res.data.isPremiumUser) {
    buyPremiumBtn.innerHTML = "Premium Member &#128081";
    reportsLink.removeAttribute("onclick");
    leaderboardLink.removeAttribute("onclick");
    leaderboardLink.setAttribute("href", "/premium/getLeaderboardPage");
    reportsLink.setAttribute("href", "/getReportsPage");
    buyPremiumBtn.removeEventListener("click", buyPremium);
  } else {
  }
}
buyPremiumBtn.addEventListener("click", buyPremium);
document.addEventListener("DOMContentLoaded", () => {
  isPremiumUser();
  getAllExpenses();
});