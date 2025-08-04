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
          <template v-if="task.isEditing">
            <q-input filled v-model="task.title" class="col" />
            <q-btn color="positive" icon="check" @click="saveTask(task)" />
          </template>
          <template v-else>
            <div class="col">{{ task.title }}</div>
            <q-btn color="secondary" icon="edit" @click="startEditing(task)" />
          </template>
          <q-btn color="negative" icon="delete" @click="deleteTask(task.id)" />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API = 'https://jsonplaceholder.typicode.com/todos'
const tasks = ref([])
const newTask = ref('')

// Load initial tasks
const fetchTasks = async () => {
  try {
    const response = await axios.get(`${API}?_limit=5`)
    tasks.value = response.data.map((task) => ({
      ...task,
      isEditing: false,
    }))
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
    const newTaskObj = {
      ...response.data,
      isEditing: false,
      // Ensure we have a unique ID for new tasks
      id: Date.now(),
    }
    tasks.value.unshift(newTaskObj)
    newTask.value = ''
  } catch (error) {
    console.error('Add task failed:', error)
  }
}

// Start editing task
const startEditing = (task) => {
  task.isEditing = true
}

// Save task changes
const saveTask = async (task) => {
  try {
    await axios.put(`${API}/${task.id}`, task)
    task.isEditing = false
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
