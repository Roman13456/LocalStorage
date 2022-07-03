// Створити скрипт, який:
// Виводить список користувачів із кнопками “Edit”, “Remove”, “View” біля кожного користувача (use data-id
// attributes)
// При натисканні на кнопку “View” відкриваються дані користувача у блоці під списком
// При натисканні на кнопку “Edit” з'являється можливість редагувати його дані. Дані зберігаються при
// натисканні на кнопку “Save”
// При натисканні на кнопку “Remove” користувач видаляється. Обов'язково підтвердження видалення
// Реалізувати можливість додавання нових користувачів. Бажано перевикористати форму редагування
// Всі дані повинні записуватися в localStorage та бути доступними на сторінці після перезавантаження
// Усі зміни зі списком мають зберігатися після оновлення сторінки
const form = document.querySelector("form")
const inputName = form.elements["name"]
const inputAge = form.elements["age"]
const inputPosition = form.elements["position"]
const list = document.querySelector(".list")
const changeToSaveNewUser = document.querySelector(".btn-change-save-new")
const submit = document.querySelector(".btn-save")
const preview = document.querySelector(".preview")
let users = []
getFromStorage()
createUsersOnList()
function setError(element,error){
    const inputControls = element.parentElement
    const errorMsg = inputControls.querySelector(".error")
    errorMsg.innerHTML=error
    inputControls.classList.add("error")
    inputControls.classList.remove("success")
    
}
function setSuccess(element){
    console.log(element)
    const inputControls = element.parentElement
    console.log(inputControls)
    const errorMsg = inputControls.querySelector(".error")
    inputControls.classList.add("success")
    inputControls.classList.remove("error")
    errorMsg.innerHTML=""
}
function validate(){
    let bool = true
    const inputNameValue = inputName.value.trim()
    const inputAgeValue = inputAge.value.trim()
    const inputPositionValue = inputPosition.value.trim()
    if(inputNameValue===""){
        setError(inputName,"Name field is empty")
        bool = false
    }else{
        setSuccess(inputName)
    }
    if(inputAgeValue===""){
        setError(inputAge,"Age field is empty")
        bool = false
    }else{
        setSuccess(inputAge)
    }
    if(inputPositionValue===""){
        setError(inputPosition,"Position field is empty")
        bool = false
    }else{
        setSuccess(inputPosition)
    }
    return bool
}
changeToSaveNewUser.addEventListener("click",()=>{
    nullFormId()
    clearInputs()
})
form.addEventListener("submit",function(e){
    e.preventDefault()
    validate()
    if(validate()){
        const formId = +(form.getAttribute("data-id"))
        if(formId===0){
            const user = {
                id:new Date().getTime(),
                name:inputName.value,
                age:inputAge.value,
                position:inputPosition.value,
            }
            users.push(user)
            createLi(user)
            updateStorage()
            clearInputs()
        }else{
            const liArray = document.querySelectorAll(".list li")
            const editedLi = document.createElement("li")
            const user = {
                id:formId,
                name:inputName.value,
                age:inputAge.value,
                position:inputPosition.value,
            }
            editedLi.setAttribute("data-id",`${user.id}`)
            editedLi.insertAdjacentHTML("afterbegin",`${user.name}<button class="edit-btn">Edit</button><button class="remove-btn">Remove</button><button class="view-btn">View</button>`)
            const index = users.findIndex((user)=>formId===user.id)
            users[index] = user
            updateStorage()
            list.replaceChild(editedLi,liArray[index])
            nullFormId()
            clearInputs()
        }
    }
})
list.addEventListener("click",function(e){
    const target = e.target
    if(target.classList.contains("remove-btn")|| target.classList.contains("view-btn")||target.classList.contains("edit-btn")){
        const parentLi = target.closest("li")
        const IdOfParentLi = +(parentLi.getAttribute("data-id"))
        const index = users.findIndex((user)=>IdOfParentLi===user.id)
        if(target.classList.contains("remove-btn")){
            //get або схоже повертають строку, треба перетворювати в число
            parentLi.remove()/////
            users.splice(index,1)
            updateStorage()
        }else if(target.classList.contains("view-btn")){
            preview.innerHTML=`${JSON.stringify(users[index])}`
        }else if(target.classList.contains("edit-btn")){
            submit.innerHTML="Save edited changes"
            inputName.value=users[index].name
            form.setAttribute("data-id",`${users[index].id}`)
            inputAge.value=users[index].age
            inputPosition.value=users[index].position
        }
    }
})
function nullFormId(){
    form.setAttribute("data-id","0")
    submit.innerHTML = "Save new user"
}
function createUsersOnList(){
    users.forEach(createLi)
}
function createLi(user){
    list.insertAdjacentHTML("beforeend",`<li data-id=${user.id}>${user.name}<div><button class="edit-btn">Edit</button><button class="remove-btn">Remove</button><button class="view-btn">View</button></div></li>`)
}
function updateStorage(){
    localStorage.setItem("users",JSON.stringify(users))
}
function getFromStorage(){
    if(localStorage.getItem("users")!==null){
        users=JSON.parse(localStorage.getItem("users"))
    }
}
function clearInputs(){
    inputName.value = ""
    inputAge.value = ""
    inputPosition.value = ""
}