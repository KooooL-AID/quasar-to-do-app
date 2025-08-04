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
            <q-btn flat color="grey" icon="close" @click="cancelEdit(task)" />
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
import { Notify } from 'quasar'
import axios from 'axios'

const API = 'https://jsonplaceholder.typicode.com/todos'
const tasks = ref([])
const newTask = ref('')

// Load tasks on mount
const fetchTasks = async () => {
  try {
    const response = await axios.get(`${API}?_limit=5`)
    tasks.value = response.data.map((task) => ({
      ...task,
      isEditing: false,
    }))
  } catch (err) {
    console.error('Fetch error:', err)
  }
}

// Add new task
const addTask = async () => {
  if (!newTask.value.trim()) return

  try {
    await axios.post(API, {
      title: newTask.value,
      completed: false,
    })

    const newTaskObj = {
      id: Date.now(), // temporary ID
      title: newTask.value,
      completed: false,
      isEditing: false,
    }

    tasks.value.unshift(newTaskObj)
    newTask.value = ''

    Notify.create({
      type: 'positive',
      message: 'Task added!',
    })
  } catch (error) {
    console.error('Add failed:', error)
    Notify.create({
      type: 'negative',
      message: 'Failed to add task',
    })
  }
}

// Start editing
const startEditing = (task) => {
  task.originalTitle = task.title
  task.isEditing = true
}

// Cancel editing
const cancelEdit = (task) => {
  task.title = task.originalTitle
  task.isEditing = false
}

// Save task
const saveTask = async (task) => {
  if (!task.title.trim()) {
    task.title = task.originalTitle
    task.isEditing = false
    return
  }

  try {
    // For tasks from the initial fetch (have real API IDs)
    if (task.id <= 200) {
      // JSONPlaceholder has 200 default todos
      await axios.put(`${API}/${task.id}`, {
        id: task.id,
        title: task.title,
        completed: task.completed,
      })
    }
    // Always update local state regardless of API success
    const taskIndex = tasks.value.findIndex((t) => t.id === task.id)
    if (taskIndex !== -1) {
      tasks.value[taskIndex] = {
        ...task,
        title: task.title,
        isEditing: false,
        originalTitle: task.title,
      }
    }

    Notify.create({
      type: 'positive',
      message: 'Task updated successfully!',
    })
  } catch (error) {
    console.error('Update failed:', error)
    // Only revert changes if it's a non-500 error
    if (error.response?.status !== 500) {
      task.title = task.originalTitle
      Notify.create({
        type: 'negative',
        message: 'Failed to update task',
      })
    }
  } finally {
    task.isEditing = false
  }
}

// Delete task
const deleteTask = async (id) => {
  try {
    await axios.delete(`${API}/${id}`)
    tasks.value = tasks.value.filter((t) => t.id !== id)
    Notify.create({
      type: 'info',
      message: 'Task deleted.',
    })
  } catch (error) {
    console.error('Delete failed:', error)
    Notify.create({
      type: 'negative',
      message: 'Failed to delete task',
    })
  }
}

onMounted(fetchTasks)
</script>
