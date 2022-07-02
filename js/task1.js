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
const saveAsEdited = document.querySelector(".btn-save-edited")
const preview = document.querySelector(".preview")
let users =[]
getFromStorage()
users.forEach(insertLi)
form.addEventListener("submit",function(e){
    e.preventDefault()
    const user = {
        id:+(new Date().getTime()),
        name:inputName.value,
        age:inputAge.value,
        position:inputPosition.value,
    }
    users.push(user)
    insertLi(user)
    updateStorage()
    clearInputs()
})
function findInArrayById(id){
    return users.findIndex((element)=>element.id===id)
}
saveAsEdited.addEventListener("click",function(){
    if(inputName.getAttribute("data-id")!==null){//
        let idOfToEdit = +(inputName.getAttribute("data-id"))//напевно завжди краще приводити до числа прямо тут, потім легко забути
        inputName.removeAttribute("data-id")
        let index = findInArrayById(idOfToEdit)
        let liArray  = document.querySelectorAll(".list li")
        let liNode = document.createElement("li")
        let user = {
            id:idOfToEdit,
            name:inputName.value,
            age:inputAge.value,
            position:inputPosition.value,
        }
        liNode.setAttribute("data-id",`${user.id}`)
        liNode.insertAdjacentHTML("afterbegin",`${user.name} <button class="edit-btn">edit</button><button class="remove-btn">remove</button><button class="view-btn">view</button>`)
        list.replaceChild(liNode,liArray[index])
        users.splice(index,1,user)
        updateStorage()
        clearInputs()
    }
})
list.addEventListener("click",function(e){
    const target = e.target
    if(target.classList.contains("remove-btn")){
        const li = target.closest("li")//have to delete li, than to delete from localStorage
        const id = +(li.getAttribute("data-id"))
        const index = findInArrayById(id)
        li.remove()
        users.splice(index,1)
        updateStorage()
    }else if(target.classList.contains("edit-btn")){
        const li = target.closest("li")//have to delete li, than to delete from localStorage
        const id = +(li.getAttribute("data-id"))
        const index = findInArrayById(id)
        inputName.value = users[index].name
        inputName.setAttribute("data-id",users[index].id)
        inputAge.value = users[index].age
        inputPosition.value = users[index].position
    }else if(target.classList.contains("view-btn")){
        const li = target.closest("li")//have to delete li, than to delete from localStorage
        const id = +(li.getAttribute("data-id"))
        const index = users.findIndex((element)=>element.id===id)
        previewData(index)
    }
})
function insertLi(user){
    list.insertAdjacentHTML("beforeend",`<li data-id = "${user.id}">${user.name} <button class="edit-btn">edit</button><button class="remove-btn">remove</button><button class="view-btn">view</button></li>`)
}
function updateStorage(){
    localStorage.setItem("users",JSON.stringify(users))
}
function getFromStorage(){
    if(JSON.parse(localStorage.getItem("users"))!==null){
        users = JSON.parse(localStorage.getItem("users"))
    }
}
function clearInputs(){
    inputName.value =""
    inputAge.value =""
    inputPosition.value =""
}
function previewData(index){
    preview.innerHTML=""
    preview.insertAdjacentHTML("afterbegin",`${JSON.stringify(users[index])}`)
}