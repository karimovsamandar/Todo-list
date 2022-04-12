let elTodoForm = document.querySelector('.todo__form');
let elTodoInput = document.querySelector('.todo__input');
let elTodoList = document.querySelector('.todo__list');
let checkbox = document.querySelector('.checkbox__todo');
let elClearBtn = document.querySelector(".todo__clear-btn")

let elAllBtn = document.querySelector('.btnAll');
let elComplateBtn = document.querySelector('.btnCompleated');
let elUncomplateBtn = document.querySelector('.btnUncompleated');
let elAllCount = document.querySelector('.allCount');
let elCompleatedCount = document.querySelector('.compleatedCount');
let elUncompleatedCount = document.querySelector('.uncompleatedCount');
let elTodosControls = document.querySelector('.todo__controls');
let elTodoTemplate = document.querySelector('#todo_item_template').
content;

elClearBtn.addEventListener("click", () => {
    storage.clear();
    todosArray = []
    updateArray();
})

let storage = window.localStorage
let localTodoArray = JSON.parse(storage.getItem("todoArray"))
let localCounter = JSON.parse(storage.getItem("counter"))


let todosArray = localTodoArray || [];
let counter = localCounter || 1



function updateArray(){
    storage.setItem("todoArray", JSON.stringify(todosArray))
    renderTodos(todosArray, elTodoList)
    calculateTodos(todosArray)
}



elTodoForm.addEventListener("submit", function(evt){
    evt.preventDefault();

    let todoInput = elTodoInput.value.trim();

    if(todoInput){
        let oneTodo = {
            id: counter++,
            todo: todoInput,
            isCompleated: false
        }
        storage.setItem("counter", JSON.stringify(counter))
        todosArray.unshift(oneTodo)
        elTodoInput.value = null
    }
    updateArray();
})




function renderTodos(array, wrapper){
    wrapper.innerHTML = null;

    let todoFragment = document.createDocumentFragment();

    array.forEach(function(item){
        let todoTemplate = elTodoTemplate.cloneNode(true)

        todoTemplate.querySelector(".todo_text").textContent = item.todo
        todoTemplate.querySelector(".checkbox__todo").dataset.todoId = item.id

        todoTemplate.querySelector(".todo__del-btn").dataset.todoId = item.id

        if(item.isCompleated === true){
            todoTemplate.querySelector(".checkbox__todo").checked = true
        }

        todoFragment.appendChild(todoTemplate)
    })

    wrapper.appendChild(todoFragment)
}

renderTodos(todosArray, elTodoList)



elTodoList.addEventListener("click", function(evt){
    let check = evt.target.matches(".checkbox__todo")
    let checkForBtn  = evt.target.matches(".todo__del-btn")

    if(check){
        let checkboxId = evt.target.dataset.todoId

        let foundTodo = todosArray.find(function(item){
            return item.id == checkboxId
        })

        let foundTodoIndex = todosArray.findIndex(function(item){
            return item.id == checkboxId
        })


        if(!foundTodo.isCompleated){
            todosArray[foundTodoIndex].isCompleated = true
            updateArray();
        }
        else{
            todosArray[foundTodoIndex].isCompleated = false
            updateArray();
        }
    }

    if(checkForBtn){
        let checkboxId = evt.target.dataset.todoId

        let foundTodoIndex = todosArray.findIndex(function(item){
            return item.id == checkboxId
        })

        todosArray.splice(foundTodoIndex, 1)
        updateArray();
    }
})




function calculateTodos(array){
    let compleatedTodos = array.filter((item)=> item.isCompleated === true)
    let notCompleatedTodos = array.filter((item)=> item.isCompleated === false)

    let allTodoNumber = array.length
    let compleatedTodoNumber = allTodoNumber - notCompleatedTodos.length
    let notCompleatedTodoNumber = allTodoNumber - compleatedTodoNumber

    elAllCount.textContent = allTodoNumber
    elCompleatedCount.textContent = compleatedTodoNumber
    elUncompleatedCount.textContent = notCompleatedTodoNumber


}

calculateTodos(todosArray)


elTodosControls.addEventListener("click", function(evt){
    let allBtn = evt.target.matches(".btnAll")
    let compleatedBtn = evt.target.matches(".btnCompleated")
    let uncompleatedBtn = evt.target.matches(".btnUncompleated")

    if(allBtn){
       renderTodos(todosArray, elTodoList)
    }
    else if(compleatedBtn){
        let compleatedTodos = todosArray.filter((item)=> item.isCompleated === true)
        renderTodos(compleatedTodos, elTodoList)
    }
    else if(uncompleatedBtn){
        let notCompleatedTodos = todosArray.filter((item)=> item.isCompleated === false)
        renderTodos(notCompleatedTodos, elTodoList)

    }
})