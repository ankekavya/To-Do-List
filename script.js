
// Get HTML elements
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const errorMessage = document.getElementById("errorMessage");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const taskDate = document.getElementById("taskDate");
const taskPriority = document.getElementById("taskPriority");

const emptyMessage = document.getElementById("emptyMessage");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");

const filterButtons = document.querySelectorAll(".filter-btn");

// Progress bar elements
const progressPercentage = document.getElementById("progressPercentage");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

// Load saved tasks
let tasks = JSON.parse(localStorage.getItem("myTasks")) || [];

// Support tasks saved before the priority feature
tasks.forEach(function(task) {
    if (!task.priority) {
        task.priority = "medium";
    }
});

// Current filter
let currentFilter = "all";

// Save tasks
function saveTasks() {
    localStorage.setItem("myTasks", JSON.stringify(tasks));
}

// Display tasks
function displayTasks() {
    taskList.innerHTML = "";

    const filteredTasks = tasks.filter(function(task) {
        if (currentFilter === "pending") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    // Empty message
    if (filteredTasks.length === 0) {
        emptyMessage.style.display = "block";

        if (tasks.length === 0) {
            emptyMessage.textContent =
                "No tasks yet. Add your first task!";
        } else {
            emptyMessage.textContent =
                "No tasks in this category!";
        }
    } else {
        emptyMessage.style.display = "none";
    }

    // Create task elements
    filteredTasks.forEach(function(task) {
        const index = tasks.indexOf(task);

        const li = document.createElement("li");

        if (task.completed) {
            li.classList.add("completed");
        }

        // Checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", function() {
            tasks[index].completed = checkbox.checked;
            saveTasks();
            displayTasks();
        });

        // Task text
        const span = document.createElement("span");
        span.textContent = task.text;
        span.className = "task-text";

        // Priority label
        const priorityBadge = document.createElement("span");
        priorityBadge.textContent =
            task.priority.charAt(0).toUpperCase() +
            task.priority.slice(1);

        priorityBadge.className =
            "priority-badge " + task.priority;

        // Buttons container
        const actions = document.createElement("div");
        actions.className = "task-actions";

        // Edit button
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "edit-btn";

        editBtn.addEventListener("click", function() {
            const newTask = prompt("Edit your task:", task.text);

            if (newTask !== null && newTask.trim() !== "") {
                tasks[index].text = newTask.trim();
                saveTasks();
                displayTasks();
            }
        });

        // Delete button with confirmation
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";

        deleteBtn.addEventListener("click", function() {
            const confirmDelete = confirm(
                "Are you sure you want to delete this task?"
            );

            if (confirmDelete) {
                tasks.splice(index, 1);
                saveTasks();
                displayTasks();
            }
        });

        // Add buttons
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        // Add elements
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(priorityBadge);

        // Display date and time
        if (task.date) {
            const dateSpan = document.createElement("small");
            dateSpan.textContent =
                new Date(task.date).toLocaleString();

            dateSpan.className = "task-date";
            li.appendChild(dateSpan);
        }

        li.appendChild(actions);
        taskList.appendChild(li);
    });

    updateSummary();
}

// Add task
function addTask() {
    const taskValue = taskInput.value.trim();

    if (taskValue === "") {
        errorMessage.textContent = "Please enter a task!";
        return;
    }

    errorMessage.textContent = "";

    tasks.push({
        text: taskValue,
        date: taskDate.value,
        priority: taskPriority.value,
        completed: false
    });

    taskInput.value = "";
    taskDate.value = "";
    taskPriority.value = "medium";

    saveTasks();
    displayTasks();
}

// Update counters and progress bar
function updateSummary() {
    const total = tasks.length;

    const completed = tasks.filter(function(task) {
        return task.completed;
    }).length;

    totalTasks.textContent = total;
    completedTasks.textContent = completed;

    let percentage = 0;

    if (total > 0) {
        percentage = Math.round((completed / total) * 100);
    }

    progressPercentage.textContent = percentage + "%";
    progressFill.style.width = percentage + "%";

    progressText.textContent =
        completed + " of " + total + " tasks completed";
}

// Add task button
addTaskBtn.addEventListener("click", addTask);

// Enter key functionality
taskInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// Filter buttons
filterButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        currentFilter = button.dataset.filter;

        filterButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");
        displayTasks();
    });
});

// Clear completed tasks
clearCompletedBtn.addEventListener("click", function() {
    tasks = tasks.filter(function(task) {
        return !task.completed;
    });

    saveTasks();
    displayTasks();
});

// Save updated task data and display saved tasks
saveTasks();
displayTasks();
