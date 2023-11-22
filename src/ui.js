import {format} from 'date-fns';
import Storage from './storage';
import Project from './projects';
import Task from './task';

export default class UI{
    //Load Content

    static loadHomePage(){
        UI.loadProjects()
        UI.initProjectButtons()
        UI.openProject('Tasks', document.getElementById('task-id'))
        document.addEventListener('keydown', UI.handleKeyboardInput)
    }

    static loadProjects(){
        Storage.getTodoList()
        .getProjects()
        .forEach((project) => {
            if(
                project.name !== 'Tasks' &&
                project.name !== 'Today' &&
                project.name !== 'Next 7 days'
            ){
                UI.createProject(project.name)
            }
        })

        UI.initAddProjectButtons()
    }

    static loadTasks(projectName){
        Storage.getTodoList()
        .getProject(projectName)
        .getTasks()
        .forEach((task) => UI.createTask(task.name, task.dueDate))

        if(projectName !== 'Today' && projectName !== 'Next 7 days'){
            UI.initAddTaskButtons()
        }
    }

    static loadProjectContent(projectName){
        const addTaskContent = document.getElementById('add-task-content-id')
        addTaskContent.innerHTML += `
        <h1 id = "project-name">${projectName}</h1>
        <div class = "tasks-list" id = "tasks-lists-id></div>`

        if(projectName !== 'Today' && projectName !== 'Next 7 days'){
            addTaskContent.innerHTML += `
            <button class="add-task" id="add-task-id">
                <img src="./img/add-logo.svg" alt="">
                <p>Add task</p>
            </button>

            <div class="task-container" id="task-container-id">
            <div class="add-task-first-row">
                <div class="first-column">
                    <label for="task-title">Title:</label>
                    <input type="text" class="input-add-task-popup" id="input-add-task-popup-id">
                </div>
                <div class="second-column">
                    <label for="task-title">Date:</label>
                    <input type="text">
                </div>
            </div>
            <div class="add-task-second-row">
                <label for="task-title">Description:</label>
                <textarea name="" id="" cols="80" rows="5"></textarea>
            </div>
            <div class="add-task-third-row">
                <div class="third-row-left-part">
                    <p>Priority:</p>
                    <div class="priority-options">
                        <select name="priorities" id="priorities-id" class="priorities-class">
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                </div>
                <div class="third-row-right-part">
                    <button class="add-task-btn" id="add-task-btn-id">Add</button>
                    <button class="cancel-task-btn" id"cancel-task-btn-id">Cancel</button>
                </div>
            </div>
        </div>
            `
        }

        UI.loadTasks(projectName)
        console.log("Hello World")
    }

    // Creating Content
    static createProject(name){
        const userProjects = document.getElementById('projects-list-id')
        userProjects.innerHTML += `
        <button class="created-project" id="created-project-id">
            <div class="left-side">
                <span>${name}</span>
            </div>
            <div class="right-side">
                <img src="./img/del-logo.svg" class="fa-times" alt="">
            </div>
        </button>
        `
        UI.initProjectButtons()
    }

    static createTask(name, dueDate){
        const tasksList = document.getElementById('created-task-id')
        tasksList.innerHTML += `
        <button class="created-task" id="created-task-id">
            <div class="created-task-left-side">
                <img src="./img/taskcircle-logo.svg" class="fa-circle" alt="">
                <p>Title:</p>
                <p class="created-task-title">${name}</p>
                <input type="text" class="input-task-name" data-input-task-name>
            </div>
            <div class="created-task-right-side">
                <p>Due Date:</p>
                <p class="due-date">${dueDate}</p>
                <input type="date" class="input-due-date" data-input-due-date>
                <img src="./img/del-logo.svg" class="fa-times" alt="">
            </div>
        </button>
        `
        UI.initAddTaskButtons()
    }

    static clear(){
        UI.clearProjectPreview()
        UI.clearProjects()
        UI.clearTasks()
    }

    static clearProjectPreview(){
        const addTaskContent = document.getElementById('add-task-content-id')
        addTaskContent.textContent = ''
    }

    static clearProjects(){
        const projectsList = document.getElementById('projects-list-id')
        projectsList.textContent = ''
    }

    static clearTasks(){
        const tasksList = document.getElementById('created-task-id')
        tasksList.textContent = ''
    }

    static closeAllPopups(){
        UI.closeAddProjectPopup()
        if(document.getElementById('add-task-id')){
            UI.closeAddTaskPopup()
        }
        
        if(
            document.getElementById('tasks-list-id') &&
            document.getElementById('tasks-list-id').innerHTML !== ''
        ){
            UI.closeAllInputs()
        }
    }

    static closeAllInputs(){
        const taskButtons = document.querySelectorAll('[created-task-id]')

        taskButtons.forEach((button) => {
            UI.closeRenameInput(button)
            UI.closeSetDateInput(button)
        })
    }

    static handleKeyboardInput(e){
        if(e.key === 'Escape') UI.closeAllPopups()
    }

    // Project Add Event Listeners

    static initAddProjectButtons(){
        const addProjectButton = document.getElementById('add-project-id')
        const addProjectPopupButton = document.getElementById('add-project-popup-id')
        const cancelProjectPopupButton = document.getElementById('button-cancel-project-popup-id')
        const addProjectPopupInput = document.getElementById('input-add-project-popup-id')

        addProjectButton.addEventListener('click', UI.openAddProjectPopup)
        addProjectPopupButton.addEventListener('click', UI.addProject)
        cancelProjectPopupButton.addEventListener('click', UI. closeAddProjectPopup)
        addProjectPopupInput.addEventListener(
            'keypress',
            UI.handleAddProjectPopupInput
        )
    }

    static openAddProjectPopup(){
        const addProjectPopup = document.getElementById('add-project-popup-buttons-id')
        const addProjectButton = document.getElementById('button-add-project-popup-id')

        UI.closeAllPopups()
        addProjectPopup.classList.add('active')
        addProjectButton.classList.add('active')
    }

    static closeAddProjectPopup(){
        const addProjectPopup = document.getElementById('add-project-popup-id')
        const addProjectButton = document.getElementById('add-project-id')
        const addProjectPopupInput = document.getElementById('input-add-project-popup-id')

        addProjectPopup.classList.remove('active')
        addProjectButton.classList.remove('active')
        addProjectPopupInput.value = ''
    }

    static addProject(){
        const addProjectPopupInput = document.getElementById('input-add-project-popup-id')
        const projectName = addProjectPopupInput.value

        if(projectName === ''){
            alert("Project name can't be empty")
            return
        }

        if(Storage.getTodoList().contains(projectName)){
            addProjectPopupInput.value = ''
            alert("Project names must be different")
            return
        }

        Storage.addProject(new Project(projectName))
        UI.createProject(projectName)
        UI.closeAddProjectPopup()
    }

    static handleAddProjectPopupInput(e){
        if (e.key === 'Enter') UI.addProject()
    }

    // Project Event Listeners

    static initProjectButtons(){
       const tasksProjectsButton = document.getElementById('task-id')
       const todayProjectsButton = document.getElementById('today-id')
       const next7DaysProjectsButton = document.getElementById('next-id')
       const projectButtons = document.querySelectorAll('[created-project-id]')

       tasksProjectsButton.addEventListener('click', UI.openTasksTasks)
       todayProjectsButton.addEventListener('click', UI.openTodayTasks)
       next7DaysProjectsButton.addEventListener('click', UI.openNext7DaysTasks)
       projectButtons.forEach((projectButton) => 
        projectButton.addEventListener('click', UI.handleProjectButton)
       )
    }

    static openTasksTasks(){
        UI.openProject('Tasks', this)
    }

    static openTodayTasks(){
        Storage.updateTodayProject()
        UI.openProject('Today', this)
    }

    static openNext7DaysTasks(){
        Storage.updateWeekProject()
        UI.openProject('Next 7 days', this)
    }

    static handleProjectButton(e){
        const projectName = this.children[0].children[1].textContent

        if(e.target.classList.contains('fa-times')){
            UI.deleteProject(projectName, this)
            return
        }

        UI.openProject(projectName, this)
    }

    static openProject(projectName, projectButton){
        const defaultProjectButtons = document.querySelectorAll('.button-default-project')
        const projectButtons = document.querySelectorAll('.created-project')
        const buttons = [...defaultProjectButtons, ...projectButtons]

        buttons.forEach((button) => button.classList.remove('active'))
        projectButton.classList.add('active')
        UI.closeAddProjectPopup()
        UI.loadProjectContent(projectName)
    }

    static deleteProject(projectName, button){
        if(button.classList.contains('active')) UI.clearProjectPreview()
        Storage.deleteProject(projectName)
        UI.clearProjects()
        UI.loadProjects()
    }

    // Add Task Event Listeners

    static initAddTaskButtons(){
        const addTaskButton = document.getElementById('add-task-id')
        const addTaskPopupButton = document.getElementById('add-task-btn-id')
        const cancelTaskPopupButton = document.getElementById('cancel-task-btn-id')
        const addTaskPopupInput = document.getElementById('input-add-task-popup-id')

        addTaskButton.addEventListener('click', UI.openAddTaskPopup)
        addTaskPopupButton.addEventListener('click', UI.addTask)
        cancelTaskPopupButton.addEventListener('click', UI. closeAddTaskPopup)
        addTaskPopupInput.addEventListener('keypress', UI.handleAddTaskPopupInput)
    }

    static openAddTaskPopup(){
        const addTaskPopup = document.getElementById('task-container-id')
        const addTaskButton = document.getElementById('add-task-id')

        UI.closeAllPopups()
        addTaskPopup.classList.add('active')
        addTaskButton.classList.add('active')
    }

    static closeAddTaskPopup(){
        const addTaskPopup = document.getElementById('task-container-id')
        const addTaskButton = document.getElementById('add-task-id')
        const addTaskInput = document.getElementById('input-add-task-popup-id')

        addTaskPopup.classList.remove('active')
        addTaskButton.classList.remove('active')
        addTaskInput.value = ''
    }

    static addTask (){
        const projectName = document.getElementById('project-name').textContent
        const addTaskPopupInput = document.getElementById('input-add-task-popup-id')
        const taskName = addTaskPopupInput.value

        if(taskName === ''){
            alert("Task name can't be empty")
            return
        }
        if (Storage.getTodoList().getProject(projectName).contains(taskName)){
            alert("Task names must be different")
            addTaskPopupInput.value = ''
            return
        }

        Storage.addTask(projectName, new Task(taskName))
        UI.createTask(taskName, 'No date')
        UI.closeAddTaskPopup()
    }

    static handleAddTaskPopupInput(e){
        if (e.key === "Enter") UI.addTask()
    }

    // Task Event Listeners

    static initTaskButtons(){
        const taskButtons = document.querySelectorAll('[created-task-id]')
        const taskNameInputs = document.querySelectorAll('[data-input-task-name]')
        const dueDateInputs = document.querySelectorAll('[data-input-due-date]')

        taskButtons.forEach((taskButton) => 
            taskButton.addEventListener('click', UI.handleTaskButton)
        )
        taskNameInputs.forEach((taskNameInput) =>
            taskNameInput.addEventListener('keypress', UI.renameTask)
        )
        dueDateInputs.forEach((dueDateInput) =>
            dueDateInput.addEventListener('change'. UI.setTaskDate)
        )
    }

    static handleTaskButton(e){
        if(e.target.classList.contains('fa-circle')){
            UI.setTaskCompleted(this)
            return
        }
        if(e.target.classList.contains('fa-times')){
            UI.deleteTask(this)
            return
        }
        if(e.target.classList.contains('created-task-title')){
            UI.openRenameInput(this)
            return
        }
        if(e.target.classList.contains('due-date')){
            UI.openSetDateInput(this)
            return
        }
    }

    static setTaskCompleted(taskButton){
        const projectName = document.getElementById('project-name').textContent
        const taskName = taskButton.children[0].children[1].textContent

        if(projectName === 'Today' || projectName === 'Next 7 days'){
            const parentProjectName = taskName.split('(')[1].split(')')[0]
            Storage.deleteTask(parentProjectName,taskName.split(' ')[0])
            if(projectName === 'Today'){
                Storage.updateTodayProject()
            }
            else{
                Storage.updateWeekProject()
            }
        }
        else{
            Storage.deleteTask(projectName, taskName)
        }
        UI.clearTasks()
        UI.loadTasks(projectName)
    }

    static deleTask(taskButton){
        const projectName = document.getElementById('project-name').textContent
        const taskName = taskButton.children[0].children[1].textContent

        if(projectName === 'Today' || projectName === 'This week'){
            const mainProjectName = taskName.split('(')[1].split(')')[0]
            Storage.deleteTask(mainProjectName,taskName)
        }
        Storage.deleteTask(projectName, taskName)
        UI.clearTasks()
        UI.loadTasks(projectName)
    }

    static openRenameInput(taskButton){
        const taskNamePara = taskButton.children[0].children[1]
        let taskName = taskNamePara.textContent
        const taskNameInput = taskButton.children[0].children[2]
        const projectName = taskButton.parentNode.children[0].textContent

        if(projectName === 'Today' || projectName === 'This week'){
            ;[taskName] = taskName.split(' (')
        }

        UI.closeAllPopups()
        taskNamePara.classList.add('active')
        taskNameInput.classList.add('active')
        taskNameInput.value = taskName
    }

    static closeRenameInput(taskButton){
        const taskName = taskButton.children[0].children[1]
        const taskNameInput = taskButton.children[0].children[2]

        taskName.classList.remove('active')
        taskNameInput.classList.remove('active')
        taskNameInput.value = ''
    }

    static renameTask(e){
        if(e.key !== 'Enter') return

        const projectName = document.getElementById('project-name').textContent
        const taskName = this.previousElementSibling.textContent
        const newTaskName = this.value

        if(newTaskName === ''){
            alert("Task name can't be empty")
            return
        }

        if(Storage.getTodoList().getProject(projectName).contains(newTaskName)){
            this.value = ''
            alert("Task names must be different")
            return
        }

        if(projectName === 'Today' || projectName === 'This week'){
            const mainProjectName = taskName.split('(')[1].split(')')[0]
            const mainTaskName = taskName.split(' ')[0]
            Storage.renameTask(projectName,taskName,
                `${newTaskName} (${mainProjectName})`
            )
            Storage.renameTask(mainProjectName, mainTaskName, newTaskName)}
            else{
                Storage.renameTask(projectName, taskName, newTaskname)
            }

            UI.clearTasks()
            UI.loadTasks(projectName)
            UI.closeRenameInput(this.parentNode.parentNode)
        }

    static openSetDateInput(taskButton){
        const dueDate = taskButton.children[1].children[0]
        const dueDateInput = taskButton.children[1].children[1]

        UI.closeAllPopups()
        dueDate.classList.add('active')
        dueDateInput.classList.add('active')
    }

    static closeSetDateInput(taskButton){
        const dueDate = taskButton.children[1].children[0]
        const dueDateInput = taskButton.children[1].children[1]

        dueDate.classList.remove('active')
        dueDateInput.classList.remove('active')
    }

    static setTaskDate(){
        const taskButton = this.parentNode.parentNode
        const projectName = document.getElementById('project-name').textContent
        const taskName = taskButton.children[0].children[1].textContent
        const newDueDate = format(new Date(this.value), 'dd/MM/yyyy')

        if(projectName === 'Today' || projectName === 'Next 7 days'){
            const mainProjectName = taskName.split('(')[1].split(')')[0]
            const mainTaskName = taskName.split(' (')[0]
            Storage.setTaskDate(projectName, taskName, newDueDate)
            Storage.setTaskDate(mainProjectName, mainTaskName, newDueDate)
            if(projectName === 'Today'){
                Storage.updateTodayProject()
            }
            else{
                Storage.updateWeekProject()
            }
        }
        else{
            Storage.setTaskDate(projectName, taskName, newDueDate)
        }
        UI.clearTasks()
        UI.loadTasks(projectName)
        UI.closeSetDateInput(taskButton)
    }
}
