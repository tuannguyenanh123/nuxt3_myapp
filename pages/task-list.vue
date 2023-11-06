<template>
  <ClientOnly>
   <div class="container">
    <div class="form">
        <h5 class="va-h5 title">Task List</h5>
        <div class="form-wrapper">
          <BaseInput
            id="task"
            class="mb-4"
            type="task"
            v-model="modelValue"
            @updateValue="handleUpdateValue"
            @keyup.enter="addTask"
          />
          <va-button preset="primary" class="mr-6 mb-2" @click="addTask"> Add Task </va-button>
        </div>
      </div>
      <div>
        <va-input @change="handleChangeSearch" v-model="valueSearch" placeholder="Search..." />
      </div>
   </div>
    <hr />
    <hr />
    <div class="tasks">
      <va-card v-for="task in state.tasks" :key="task.id" class="task">
        <va-card-title>Title</va-card-title>
        <va-card-content v-if="!(taskEdited.isEdit && task.id === taskEdited.task.id)">
          {{ task.title }}
        </va-card-content>
        <BaseInput
          id="taskEdit"
          class="mb-4 task-input"
          type="taskEdit"
          v-if="taskEdited.isEdit && task.id === taskEdited.task.id"
          v-model="modelValueEdit"
          @updateValue="handleUpdateValueEdit"
          @keyup.enter="saveTask(task)"
        />
        <va-card-actions align="right">
          <va-button @click="deleteTask(task.id)">Delete</va-button>
        </va-card-actions>
        <va-card-actions align="right">
          <va-button v-if="!taskEdited.isEdit" @click="editTask(task)">Edit</va-button>
          <va-button
            v-if="taskEdited.isEdit && task.id === taskEdited.task.id"
            @click="cancelEditTask()"
            >Cancel</va-button
          >
          <va-button
            v-if="taskEdited.isEdit && task.id === taskEdited.task.id"
            @click="saveTask(task)"
            >Save</va-button
          >
        </va-card-actions>
      </va-card>
    </div>
  </ClientOnly>
</template>

<script setup>
import { reactive, ref } from 'vue'
const dummyData = [
  {
    id: 1,
    title: 'Task 1'
  },
  {
    id: 2,
    title: 'Task 2'
  }
]
const modelValue = ref('')
const modelValueEdit = ref('')
const saveValue = ref('')
const valueSearch = ref('')
const taskEdited = reactive({
  isEdit: false,
  task: null
})

const state = reactive({
  tasks: dummyData
})

function addTask() {
  if (!modelValue.value) return
  state.tasks.push({
    id: state.tasks.length + 1,
    title: modelValue.value
  })
  modelValue.value = ''
}

function deleteTask(id) {
  if (taskEdited.isEdit) return
  const updateTasks = state.tasks.filter((task) => task.id !== id)
  state.tasks = updateTasks
}

function editTask(task) {
  taskEdited.isEdit = true
  taskEdited.task = task
  modelValueEdit.value = task.title
}

function cancelEditTask() {
  taskEdited.isEdit = false
}

function saveTask(task) {
  task = taskEdited.task
  taskEdited.isEdit = false
  task.title = saveValue.value
}
function handleUpdateValue(val) {
  modelValue.value = val
}

function handleUpdateValueEdit(item) {
  saveValue.value = item
}

function handleChangeSearch(e) {
    if (e.target.value === "") {
        state.tasks = dummyData   
    }; 
    const updateTasks = state.tasks.filter((task) => task.title.toLowerCase().includes(e.target.value.toLowerCase()))
    state.tasks = updateTasks
}

</script>

<style lang="scss" scoped>

.container{
    display: flex;
     align-items: center;
     justify-content: space-between;
     padding: 0 20px;
    .form {
      &-wrapper {
        padding: 20px;
        padding-left: 0;
        display: flex;
        gap: 20px;
        justify-content: start;
        align-items: center;
      }
    }
}
.tasks {
  display: flex;
  flex-direction: column;
  gap: 10px;
  .task{
    &-input {
        padding-left: 20px;
    }
  }
}
</style>
