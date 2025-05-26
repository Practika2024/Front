import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import useActions from "../../hooks/useActions";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt, FaEnvelope, FaBell, FaEdit, FaTrash } from "react-icons/fa";
import { FaSun, FaMoon } from 'react-icons/fa';
import { isEmailConfirmed } from "../../store/state/actions/userActions";
import "./layout.css";
import ContainerReminderModal from '../../pages/tare/components/tareModals/ContainerReminderModal';
import { updateReminder } from '../../store/state/actions/reminderActions';

const Header = () => {
  console.log('Header render');
  const currentUser = useSelector((store) => store.user.currentUser);
  const isAuthenticated = useSelector((store) => store.user.isAuthenticated);
  const reminders = useSelector((store) => store.reminders.reminders);
  const { logoutUser, getNotCompletedReminders, getCompletedReminders, getAllReminders, deleteReminder } = useActions();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [emailConfirmed, setEmailConfirmed] = useState(true);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState('future');
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const isMounted = useRef(true);
  const abortControllerRef = useRef(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [editReminderId, setEditReminderId] = useState(null);

  console.log('notificationsOpen:', notificationsOpen, 'activeTab:', activeTab);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const checkEmailConfirmation = useCallback(async () => {
    if (!currentUser?.id || !isMounted.current) return;

    try {
      abortControllerRef.current = new AbortController();
      const confirmed = await isEmailConfirmed(currentUser.id)();
      if (isMounted.current) {
        setEmailConfirmed(confirmed);
      }
    } catch (error) {
      if (error.name === 'AbortError') return;
      if (isMounted.current) {
        setEmailConfirmed(true);
      }
    } finally {
      abortControllerRef.current = null;
    }
  }, [currentUser]);

  useEffect(() => {
    checkEmailConfirmation();
  }, [checkEmailConfirmation]);

  const handleClickOutside = useCallback((event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
    if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
      setNotificationsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (dropdownOpen || notificationsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen, notificationsOpen, handleClickOutside]);

  async function loadReminders() {
    console.log('CALL loadReminders');
    console.log('notificationsOpen:', notificationsOpen, 'isMounted:', isMounted.current);
    if (!notificationsOpen || !isMounted.current) {
      console.log('RETURN: !notificationsOpen || !isMounted.current');
      return;
    }
    try {
      setLoading(true);
      abortControllerRef.current = new AbortController();
      console.log('activeTab value:', activeTab, typeof activeTab);
      console.log('getNotCompletedReminders:', getNotCompletedReminders);
      console.log('getCompletedReminders:', getCompletedReminders);
      console.log('getAllReminders:', getAllReminders);
      if (activeTab === 'future') {
        console.log('CALL getNotCompletedReminders');
        await getNotCompletedReminders();
      } else if (activeTab === 'past') {
        console.log('CALL getCompletedReminders');
        await getCompletedReminders();
      } else if (activeTab === 'all') {
        console.log('CALL getAllReminders');
        await getAllReminders();
      } else {
        console.log('NO MATCH for activeTab');
      }
      if (isMounted.current) {
        const hasUnread = reminders.some(reminder => !reminder.isViewed);
        setHasUnreadNotifications(hasUnread);
        console.log('Reminders after fetch:', reminders);
      }
    } catch (error) {
      if (error.name === 'AbortError') return;
      console.error('Error loading reminders:', error);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
      abortControllerRef.current = null;
    }
  }

  useEffect(() => {
    console.log('useEffect [notificationsOpen, activeTab] fired');
    if (notificationsOpen) {
      loadReminders();
    }
  }, [notificationsOpen, activeTab]);

  const handleLogout = useCallback(() => {
    logoutUser();
    navigate("/");
  }, [logoutUser, navigate]);

  const handleEmailConfirm = useCallback(() => {
    navigate("/email-confirmation");
    setDropdownOpen(false);
  }, [navigate]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const handleDeleteReminder = useCallback(async (reminderId) => {
    if (!isMounted.current) return;

    try {
      setLoading(true);
      abortControllerRef.current = new AbortController();
      await deleteReminder(reminderId);
      if (isMounted.current) {
        await loadReminders();
      }
    } catch (error) {
      if (error.name === 'AbortError') return;
      console.error('Error deleting reminder:', error);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
      abortControllerRef.current = null;
    }
  }, [deleteReminder, loadReminders]);

  const handleEditReminder = useCallback((reminderId) => {
    const reminder = reminders.find(r => r.id === reminderId);
    if (reminder) {
      setEditForm({
        title: reminder.title,
        dueDate: reminder.dueDate,
        type: reminder.typeId?.toString() || '',
        containerId: reminder.containerId || ''
      });
      setEditReminderId(reminderId);
      setEditModalOpen(true);
    }
  }, [reminders]);

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setEditForm({});
    setEditReminderId(null);
  };

  const handleEditModalSubmit = async () => {
    if (!editReminderId) return;
    try {
      await updateReminder(editReminderId, {
        title: editForm.title,
        dueDate: editForm.dueDate,
        type: Number(editForm.type),
        containerId: editForm.containerId
      })();
      setEditModalOpen(false);
      setEditForm({});
      setEditReminderId(null);
      loadReminders();
    } catch (e) {
      // handle error
    }
  };

  if (!isAuthenticated) return null;

  return (
    <header className="custom-header">
      <div className="header-left">
        <a href="/" className="navbar-brand d-flex align-items-center">
          <img src="/image-removebg-preview.png" height="40" alt="TrackTara Logo" loading="lazy" />
          <h5 className="navbar-title fs-5 ms-3 mb-0">TrackTara</h5>
        </a>
      </div>
      <div className="header-center"></div>
      <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button 
          className="theme-toggle-btn" 
          onClick={toggleTheme} 
          aria-label="Змінити тему"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        
        <div className="notifications-btn" ref={notificationsRef}>
          <button 
            className={`notifications-btn ${hasUnreadNotifications ? 'has-notifications' : ''}`}
            onClick={() => setNotificationsOpen((v) => !v)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: '8px',
              borderRadius: '50%',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              position: 'relative',
              color: theme === 'light' ? '#1976d2' : '#ffd600',
              transition: 'all 0.2s ease'
            }}
          >
            <FaBell size={22} />
            {hasUnreadNotifications && (
              <span className="notification-badge"></span>
            )}
          </button>
          {notificationsOpen && (
            <div
              className="notifications-dropdown-menu"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="notifications-header">
                <h6>Сповіщення</h6>
                <div className="notifications-tabs">
                  <div
                    className={`notifications-tab${activeTab === 'future' ? ' active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab('future');
                    }}
                  >
                    Майбутні
                  </div>
                  <div
                    className={`notifications-tab${activeTab === 'past' ? ' active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab('past');
                    }}
                  >
                    Наставші
                  </div>
                  <div
                    className={`notifications-tab${activeTab === 'all' ? ' active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab('all');
                    }}
                  >
                    Всі
                  </div>
                </div>
              </div>
              <div
                className="notifications-list"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                {loading ? (
                  <div className="notification-item">
                    <p>Завантаження...</p>
                  </div>
                ) : (activeTab === 'future' ?
                  reminders.filter(r => new Date(r.dueDate) > new Date()).length === 0 ? (
                    <div className="notification-item">
                      <p>Немає сповіщень</p>
                    </div>
                  ) : (
                    reminders.filter(r => new Date(r.dueDate) > new Date()).map((reminder) => (
                      <div className="notification-item" key={reminder.id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: 500 }}>{reminder.title}</div>
                            <div style={{ fontSize: 12, color: '#888' }}>{new Date(reminder.dueDate).toLocaleString()}</div>
                          </div>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditReminder(reminder.id);
                              }} 
                              className="table-action-btn" 
                              title="Редагувати"
                            >
                              <FaEdit />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteReminder(reminder.id);
                              }} 
                              className="table-action-btn" 
                              title="Видалити"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (activeTab === 'all' ?
                    reminders.length === 0 ? (
                      <div className="notification-item">
                        <p>Немає сповіщень</p>
                      </div>
                    ) : (
                      reminders.map((reminder) => (
                        <div className="notification-item" key={reminder.id}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <div style={{ fontWeight: 500 }}>{reminder.title}</div>
                              <div style={{ fontSize: 12, color: '#888' }}>{new Date(reminder.dueDate).toLocaleString()}</div>
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditReminder(reminder.id);
                                }} 
                                className="table-action-btn" 
                                title="Редагувати"
                              >
                                <FaEdit />
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteReminder(reminder.id);
                                }} 
                                className="table-action-btn" 
                                title="Видалити"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      reminders.length === 0 ? (
                        <div className="notification-item">
                          <p>Немає сповіщень</p>
                        </div>
                      ) : (
                        reminders.map((reminder) => (
                          <div className="notification-item" key={reminder.id}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <div style={{ fontWeight: 500 }}>{reminder.title}</div>
                                <div style={{ fontSize: 12, color: '#888' }}>{new Date(reminder.dueDate).toLocaleString()}</div>
                              </div>
                              <div style={{ display: 'flex', gap: 8 }}>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditReminder(reminder.id);
                                  }} 
                                  className="table-action-btn" 
                                  title="Редагувати"
                                >
                                  <FaEdit />
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteReminder(reminder.id);
                                  }} 
                                  className="table-action-btn" 
                                  title="Видалити"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )
                    )
                  )
                )}
              </div>
            </div>
          )}
        </div>

        <div className="user-btn" ref={dropdownRef}>
          <button 
            className="user-btn" 
            onClick={() => setDropdownOpen((v) => !v)} 
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <FaUserCircle size={28} />
            <span style={{ fontWeight: 500 }}>{currentUser?.email}</span>
          </button>
          {dropdownOpen && (
            <div className="user-dropdown-menu">
              {!emailConfirmed && (
                <button 
                  className="user-dropdown-item" 
                  onClick={handleEmailConfirm} 
                  style={{ color: '#dc3545' }}
                >
                  <FaEnvelope /> Підтвердити Email
                </button>
              )}
              <button 
                className="user-dropdown-item" 
                onClick={handleLogout}
              >
                <FaSignOutAlt /> Вийти
              </button>
            </div>
          )}
        </div>
      </div>
      <ContainerReminderModal
        show={editModalOpen}
        onHide={handleEditModalClose}
        form={editForm}
        setForm={setEditForm}
        onSubmit={handleEditModalSubmit}
      />
    </header>
  );
};

export default Header; 