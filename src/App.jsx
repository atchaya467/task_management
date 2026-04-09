import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [inputValue, setInputValue] = useState('');
  const [category, setCategory] = useState('WORK');

  const categories = ['WORK', 'LIFE', 'URGENT', 'IDEAS'];

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTask = {
      id: Date.now(),
      text: inputValue,
      completed: false,
      category: category,
      createdAt: new Date().toLocaleDateString()
    };

    setTasks([newTask, ...tasks]);
    setInputValue('');
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="tasks-container">
      <motion.h1 
        initial={{ scale: 0.8, rotate: 0 }}
        animate={{ scale: 1, rotate: -2 }}
        whileHover={{ rotate: 0, scale: 1.05 }}
      >
        TASK QUEST
      </motion.h1>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ 
          background: '#000', 
          color: '#fff', 
          padding: '0.5rem 1rem', 
          marginBottom: '1rem',
          display: 'flex', 
          justifyContent: 'space-between',
          fontWeight: 700,
          border: '3px solid #000'
        }}>
          <span>PROGRESS</span>
          <span>{completedCount} / {tasks.length} DONE</span>
        </div>
        
        <div style={{ 
          height: '20px', 
          background: '#fff', 
          border: '3px solid #000',
          boxShadow: '3px 3px 0px 0px #000'
        }}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0}%` }}
            style={{ 
              height: '100%', 
              background: 'var(--accent-cyan)',
              transition: 'width 0.3s'
            }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <form onSubmit={addTask} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="ADD NEW QUEST..."
          />
          <button type="submit" className="btn-add">
            <Plus size={32} />
          </button>
        </form>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`category-pill ${category === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="task-list">
        <AnimatePresence mode="popLayout">
          {tasks.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ 
                textAlign: 'center', 
                padding: '2rem', 
                border: '3px dashed #000',
                fontWeight: 700
              }}
              key="empty"
            >
              YOUR BOARD IS EMPTY. START A MISSION!
            </motion.div>
          ) : (
            tasks.map(task => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: 50 }}
                className={`task-item ${task.completed ? 'completed' : ''}`}
              >
                <div 
                  className={`checkbox ${task.completed ? 'checked' : ''}`}
                  onClick={() => toggleTask(task.id)}
                >
                  {task.completed && <Check size={18} />}
                </div>

                <div className="flex-1" style={{ flex: 1 }}>
                  <p className={`task-text ${task.completed ? 'completed' : ''}`}>
                    {task.text}
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      background: '#000', 
                      color: '#fff', 
                      padding: '0.1rem 0.4rem',
                      fontWeight: 800
                    }}>
                      {task.category}
                    </span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>
                      {task.createdAt}
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="btn-delete"
                >
                  <Trash2 size={20} />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
