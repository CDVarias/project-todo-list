import { compareAsc, toDate } from "date-fns";
import Project from "./projects";
import Task from "./task";

export default class TodoList{
    constructor(){
        this.projects = []
        this.projects.push(new Project ('Tasks'))
        this.projects.push(new Project ('Today'))
        this.projects.push(new Project('Next 7 days'))
    }

    setProjects(projects){
        this.projects = projects
    }

    getProjects(){
        return this.projects
    }

    getProject(projectName){
        return this.projects.find((project) => project.getName() === projectName)
    }

    contains(projectName){
        return this.projects.some((project) => project.getName() === projectName)
    }

    addProject(newProject){
        if(this.projects.find((project) => project.name === newProject.name))
        return this.projects.push(newProject)
    }

    deleteProject(projectName){
        const projectToDelete = this.projects.find((project) => project.getName() === projectName)
        this.projects.splice(this.projects.indexOf(projectToDelete), 1)
    }

    updateTodayProject(){
        this.getProject('Today').tasks = []

        this.projects.forEach((project) => {
            if(project.getName() === 'Today' || project.getName() === 'Next 7 Days')
            return

            const todayTasks = project.getTasksToday()
            todayTasks.forEach((task) => {
                const taskName = `${task.getName()} (${project.getName()})`
                this.getProject('Today').addTask(new Task(taskName,task.getDate()))
            })
        })
    }

    updateWeekProject(){
        this.getProject('Next 7 days').tasks = []

        this.projects.forEach((project) => {
            if(project.getName() === 'Today' || project.getName() === 'Next 7 Days')
            return

            const weekTasks = project.getTasksThisWeek()
            weekTasks.forEach((task) => {
                const taskName = `${task.getName()} (${project.getName()})`
                this.getProject('Next 7 days').addTask(new Task(taskName,task.getDate()))
            })
        })

        this.getProject('Next 7 days').setTasks(
            this.getProject('Next 7 days')
            .getTasks()
            .sort((taskA,taskB) =>
            compareAsc(
                toDate(new Date(taskA.getDateFormatted())),
                toDate(new Date(taskB.getDateFormatted()))
            ))
        )
    }
}