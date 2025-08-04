<template>
  <q-page class="q-pa-md">
    <!-- Input Field & Submit Btn -->
    <div class="row q-col-gutter-sm">
      <div class="col">
        <q-input filled v-model="newTask" label="Enter Task Name" />
      </div>
      <div>
        <q-btn color="primary" label="Submit" @click="addTask" />
      </div>
    </div>

    <!-- Cards (Task List) -->
    <div class="q-mt-lg">
      <q-card v-for="task in tasks" :key="task.id" class="q-mb-sm">
        <q-card-section class="row q-gutter-sm items-center">
          <q-input filled v-model="task.title" class="col" />
          <q-btn color="secondary" icon="edit" @click="updateTask(task)" />
          <q-btn color="negative" icon="delete" @click="deleteTask(task.id)" />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API = 'https://jsonplaceholder.typicode.com/todos' // fetch tasks from this API
// Note: This API does not persist changes — it's for front-end testing only.

const tasks = ref([])
const newTask = ref('')

// Load initial tasks
const fetchTasks = async () => {
  try {
    const response = await axios.get(`${API}?_limit=5`)
    tasks.value = response.data
  } catch (error) {
    console.error('Failed to fetch tasks:', error)
  }
}

// Add new task
const addTask = async () => {
  if (!newTask.value.trim()) return

  try {
    const response = await axios.post(API, {
      title: newTask.value,
      completed: false,
    })
    tasks.value.unshift(response.data)
    newTask.value = ''
  } catch (error) {
    console.error('Add task failed:', error)
  }
}

// Update task
const updateTask = async (task) => {
  try {
    await axios.put(`${API}/${task.id}`, task)
  } catch (error) {
    console.error('Update failed:', error)
  }
}

// Delete task
const deleteTask = async (id) => {
  try {
    await axios.delete(`${API}/${id}`)
    tasks.value = tasks.value.filter((t) => t.id !== id)
  } catch (error) {
    console.error('Delete failed:', error)
  }
}

onMounted(fetchTasks)
</script>
