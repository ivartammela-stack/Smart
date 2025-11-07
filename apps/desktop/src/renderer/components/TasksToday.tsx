import React, { useState, useEffect } from 'react';
import api from '../utils/api';

type TaskFilter = 'all' | 'pending' | 'completed';

interface Task {
  id: number;
  company_id?: number | null;
  deal_id?: number | null;
  title: string;
  description?: string | null;
  due_date: string | null;
  completed: boolean;
  assigned_to?: number | null;
  created_at: string;
  updated_at: string;
}

interface Company {
  id: number;
  name: string;
}

interface Deal {
  id: number;
  company_id: number;
  title: string;
  value: number;
  status: string;
}

interface User {
  id: number;
  username: string;
  email: string;
}

interface TasksTodayProps {
  onBack: () => void;
}

const TasksToday: React.FC<TasksTodayProps> = ({ onBack }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<TaskFilter>('all');
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company_id: '',
    deal_id: '',
    due_date: '',
    assigned_to: '',
  });

  useEffect(() => {
    fetchTasks();
    fetchCompanies();
    fetchDeals();
    fetchUsers();
    
    // Check if there's a filter from Dashboard
    const savedFilter = localStorage.getItem('tasksFilter');
    if (savedFilter && (savedFilter === 'all' || savedFilter === 'pending' || savedFilter === 'completed')) {
      setFilter(savedFilter as TaskFilter);
      localStorage.removeItem('tasksFilter'); // Clear after reading
    }
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tasks/today');
      const tasksList = response.data || response || [];
      setTasks(tasksList);
      setError('');
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Ülesannete laadimine ebaõnnestus');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/companies');
      const companiesList = response.data || [];
      setCompanies(companiesList);
    } catch (err) {
      console.error('❌ Error fetching companies:', err);
    }
  };

  const fetchDeals = async () => {
    try {
      const response = await api.get('/deals');
      // Backend might return { data: [...] } or [...] directly
      const dealsList = response.data || response || [];
      setDeals(dealsList);
    } catch (err) {
      console.error('Error fetching deals:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      const usersList = response.users || [];
      setUsers(usersList);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const payload = {
        title: formData.title,
        description: formData.description || null,
        company_id: formData.company_id ? parseInt(formData.company_id) : null,
        deal_id: formData.deal_id ? parseInt(formData.deal_id) : null,
        due_date: formData.due_date || null,
        assigned_to: formData.assigned_to ? parseInt(formData.assigned_to) : null,
      };

      if (editingTask) {
        await api.put(`/tasks/${editingTask.id}`, payload);
      } else {
        await api.post('/tasks', payload);
      }
      
      // Reset form and refresh list
      setFormData({
        title: '',
        description: '',
        company_id: '',
        deal_id: '',
        due_date: '',
        assigned_to: '',
      });
      setShowModal(false);
      setEditingTask(null);
      
      await fetchTasks();
    } catch (err) {
      console.error('Error saving task:', err);
      setError(err instanceof Error ? err.message : 'Salvestamine ebaõnnestus');
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      await api.put(`/tasks/${task.id}`, { completed: !task.completed });
      // Update local state
      setTasks(prev => 
        prev.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t)
      );
    } catch (err) {
      setError('Ülesande staatuse muutmine ebaõnnestus');
      console.error(err);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      company_id: task.company_id ? task.company_id.toString() : '',
      deal_id: task.deal_id ? task.deal_id.toString() : '',
      due_date: task.due_date || '',
      assigned_to: task.assigned_to ? task.assigned_to.toString() : '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Oled kindel, et soovid selle ülesande kustutada?')) {
      try {
        await api.delete(`/tasks/${id}`);
        fetchTasks();
      } catch (err) {
        setError('Kustutamine ebaõnnestus');
        console.error(err);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      company_id: '',
      deal_id: '',
      due_date: '',
      assigned_to: '',
    });
    setError('');
  };

  const getCompanyName = (companyId?: number | null) => {
    if (!companyId) return '—';
    const company = companies.find(c => c.id === companyId);
    return company ? company.name : `#${companyId}`;
  };

  const getDealTitle = (dealId?: number | null) => {
    if (!dealId) return '—';
    const deal = deals.find(d => d.id === dealId);
    return deal ? deal.title : `#${dealId}`;
  };

  const getUserName = (userId?: number | null) => {
    if (!userId) return '—';
    const user = users.find(u => u.id === userId);
    return user ? user.username : `#${userId}`;
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const percentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  if (loading) {
    return <div className="loading-container"><p>Tänaste ülesannete laadimine...</p></div>;
  }

  return (
    <div className="tasks-today-container">
      <div className="tasks-today-layout">
        {/* Header with progress */}
        <div className="tasks-today-header">
          <div className="tasks-today-title-block">
            <button onClick={onBack} className="sf-ghost-button" style={{alignSelf: 'flex-start', marginBottom: '8px'}}>
              ← Tagasi
            </button>
            <h1 className="tasks-today-title">✅ Tänased ülesanded</h1>
            <p className="tasks-today-subtitle">
              Fookuses ainult need tegevused, mille tähtaeg on täna.
            </p>
            
            <div className="tasks-progress">
              <strong>Tehtud: {completedCount}/{totalCount}</strong> · Täitmismäär: {percentage}%
            </div>
            <div className="tasks-progress-bar">
              <div className="tasks-progress-bar-fill" style={{ width: `${percentage}%` }} />
            </div>
          </div>

          <div className="tasks-filters">
            <button
              className={filter === 'all' ? 'filter-chip filter-chip-active' : 'filter-chip'}
              onClick={() => setFilter('all')}
            >
              Kõik
            </button>
            <button
              className={filter === 'pending' ? 'filter-chip filter-chip-active' : 'filter-chip'}
              onClick={() => setFilter('pending')}
            >
              Ootel
            </button>
            <button
              className={filter === 'completed' ? 'filter-chip filter-chip-active' : 'filter-chip'}
              onClick={() => setFilter('completed')}
            >
              Tehtud
            </button>
            <button 
              onClick={() => setShowModal(true)} 
              className="filter-chip"
              style={{background: 'var(--sf-primary)', borderColor: 'var(--sf-primary)', color: 'white'}}
            >
              + Lisa uus
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Tasks table */}
        <div className="tasks-card">
          <table className="tasks-table">
          <thead>
            <tr>
              <th className="tasks-checkbox-cell"></th>
              <th>Ülesanne</th>
              <th>Ettevõte</th>
              <th>Tehing</th>
              <th>Tähtaeg</th>
              <th>Vastutaja</th>
              <th className="tasks-actions-cell">Tegevused</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-state">
                  {filter === 'all' 
                    ? 'Tänaseks pole ühtegi ülesannet. Hea töö! 🎉'
                    : filter === 'pending'
                    ? 'Kõik tänased ülesanded on tehtud! 🎉'
                    : 'Ühtegi täidetud ülesannet pole.'}
                </td>
              </tr>
            ) : (
              filteredTasks.map((task) => (
                <tr key={task.id} className={task.completed ? 'tasks-row-completed' : ''}>
                  <td className="tasks-checkbox-cell">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleComplete(task)}
                      className="tasks-checkbox"
                    />
                  </td>
                  <td>
                    <div className={task.completed ? 'task-title-completed' : 'task-title'}>
                      {task.title}
                    </div>
                    {task.description && (
                      <div className="task-meta">{task.description}</div>
                    )}
                  </td>
                  <td>
                    {task.company_id ? (
                      <div className="tasks-pill">
                        <span className="tasks-pill-dot" />
                        <span>{getCompanyName(task.company_id)}</span>
                      </div>
                    ) : (
                      <span className="task-meta">—</span>
                    )}
                  </td>
                  <td>
                    {task.deal_id ? (
                      <div className="tasks-pill">
                        <span className="tasks-pill-dot-warning" />
                        <span>{getDealTitle(task.deal_id)}</span>
                      </div>
                    ) : (
                      <span className="task-meta">—</span>
                    )}
                  </td>
                  <td>
                    <div className="task-meta">{task.due_date || 'Täna'}</div>
                  </td>
                  <td>
                    {task.assigned_to ? (
                      <div className="tasks-pill">
                        <span className="tasks-pill-dot-muted" />
                        <span>{getUserName(task.assigned_to)}</span>
                      </div>
                    ) : (
                      <span className="task-meta">Määramata</span>
                    )}
                  </td>
                  <td className="tasks-actions-cell">
                    <button
                      className="tasks-action-button"
                      onClick={() => handleEdit(task)}
                    >
                      Muuda
                    </button>
                    <button
                      className="tasks-action-button"
                      onClick={() => handleDelete(task.id)}
                    >
                      Kustuta
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingTask ? 'Muuda ülesannet' : 'Lisa uus ülesanne'}</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Ülesande nimi *</label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  autoFocus
                  placeholder="nt Saada pakkumine"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Kirjeldus</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Täpsem kirjeldus..."
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="company_id">Ettevõte</label>
                  <select
                    id="company_id"
                    value={formData.company_id}
                    onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
                  >
                    <option value="">Vali ettevõte...</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="deal_id">Tehing</label>
                  <select
                    id="deal_id"
                    value={formData.deal_id}
                    onChange={(e) => setFormData({ ...formData, deal_id: e.target.value })}
                  >
                    <option value="">Vali tehing...</option>
                    {deals.map((deal) => (
                      <option key={deal.id} value={deal.id}>
                        {deal.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="due_date">Tähtaeg</label>
                  <input
                    type="date"
                    id="due_date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="assigned_to">Vastutaja</label>
                  <select
                    id="assigned_to"
                    value={formData.assigned_to}
                    onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                  >
                    <option value="">Vali vastutaja...</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.username} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingTask ? 'Salvesta muudatused' : 'Lisa ülesanne'}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleCloseModal}
                >
                  Tühista
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksToday;

