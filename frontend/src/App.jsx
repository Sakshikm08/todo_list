import { useState } from 'react'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const [initialLoad, setInitialLoad] = useState(true)
  const [loading, setLoading] = useState(false)
  
  const fetchTasks = async () => {
    try {
      setLoading(true)
          const response = await axios.get(`${API_BASE_URL}/tasks`);

      setTasks(response.data)
      setInitialLoad(true)
    } catch (error) {
      console.error('Error fetching tasks:', error)
      alert('Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }

  const addTask = (e) => {
    e.preventDefault()
    if (!newTask.trim()) return

    const task = {
      _id: Date.now().toString(),
      text: newTask.trim(),
      completed: false
    }

    setTasks([task, ...tasks])
    setNewTask('')
  }

  const toggleTask = (taskId, currentStatus) => {
    setTasks(tasks.map(task =>
      task._id === taskId ? { ...task, completed: !currentStatus } : task
    ))
  }

  const deleteTask = (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return
    setTasks(tasks.filter(task => task._id !== taskId))
  }

  const completedTasks = tasks.filter(task => task.completed)
  const pendingTasks = tasks.filter(task => !task.completed)

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>Todo List</h1>
          <p>Simple task management app</p>
        </header>

        {/* Add Task Form */}
        <form onSubmit={addTask} className="task-form">
          <div className="input-group">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="What needs to be done?"
              className="task-input"
            />
            <button
              type="submit"
              className="add-button"
              disabled={!newTask.trim()}
            >
              Add Task
            </button>
          </div>
        </form>

        {/* Tasks List */}
        {initialLoad && (
          <div className="tasks-container">
            {/* Pending Tasks */}
            {pendingTasks.length > 0 && (
              <div className="task-section">
                <h2>Pending Tasks ({pendingTasks.length})</h2>
                <div className="tasks-list">
                  {pendingTasks.map(task => (
                    <TaskItem
                      key={task._id}
                      task={task}
                      onToggle={toggleTask}
                      onDelete={deleteTask}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <div className="task-section">
                <h2>Completed Tasks ({completedTasks.length})</h2>
                <div className="tasks-list completed">
                  {completedTasks.map(task => (
                    <TaskItem
                      key={task._id}
                      task={task}
                      onToggle={toggleTask}
                      onDelete={deleteTask}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {tasks.length === 0 && (
              <div className="empty-state">
                <p>No tasks yet. Add a task to get started!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ✅ Fixed TaskItem Component
function TaskItem({ task, onToggle, onDelete }) {
  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <button
          onClick={() => onToggle(task._id, task.completed)}
          className={`checkbox ${task.completed ? 'checked' : ''}`}
          aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {task.completed && '✓'}
        </button>
        <span className="task-text">{task.text}</span>
      </div>
      <button
        onClick={() => onDelete(task._id)}
        className="delete-button"
        aria-label="Delete task"
      >
        ×
      </button>
    </div>
  )
}

export default App
