import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api";
import Navbar from "../components/Navbar";
import TodoForm from "../components/TodoForm";
import TodoItem from "../components/TodoItem";

function Todo() {
  const navigate = useNavigate();

  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [busyIds, setBusyIds] = useState([]);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  }, [navigate]);

  const fetchTodos = useCallback(async () => {
    try {
      setError("");

      const response = await api.get("/todos");
      setTodos(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        return;
      }

      setError("Couldn't load your tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login", { replace: true });
      return;
    }

    fetchTodos();
  }, [navigate, fetchTodos]);

  const addTodo = async (title) => {
    try {
      setAdding(true);
      setError("");

      const response = await api.post("/todos", { title });

      setTodos((current) => [response.data, ...current]);
      return true;
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        return false;
      }

      setError(err.response?.data?.message || "Couldn't add the task.");
      return false;
    } finally {
      setAdding(false);
    }
  };

  const toggleTodo = async (todo) => {
    if (busyIds.includes(todo._id)) return;

    setBusyIds((current) => [...current, todo._id]);
    setError("");

    try {
      const response = await api.put(`/todos/${todo._id}`, {
        completed: !todo.completed,
      });

      setTodos((current) =>
        current.map((item) =>
          item._id === todo._id ? response.data : item
        )
      );
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        return;
      }

      setError("Couldn't save the checkbox status. Please try again.");
    } finally {
      setBusyIds((current) =>
        current.filter((id) => id !== todo._id)
      );
    }
  };

  const deleteTodo = async (id) => {
    if (busyIds.includes(id)) return;

    setBusyIds((current) => [...current, id]);
    setError("");

    try {
      await api.delete(`/todos/${id}`);

      setTodos((current) => current.filter((todo) => todo._id !== id));
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        return;
      }

      setError("Couldn't delete the task. Please try again.");
    } finally {
      setBusyIds((current) => current.filter((item) => item !== id));
    }
  };

  const completedCount = todos.filter((todo) => todo.completed).length;

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <div className="app-shell">
      <Navbar />

      <main className="dashboard">
        <section className="welcome-section">
          <p className="eyebrow">YOUR PERSONAL WORKSPACE</p>
          <p className="muted">
            Small steps every day lead to big results.
          </p>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">☷</span>
            <div>
              <p>Total tasks</p>
              <h2>{todos.length}</h2>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">✓</span>
            <div>
              <p>Completed</p>
              <h2>{completedCount}</h2>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">◷</span>
            <div>
              <p>Remaining</p>
              <h2>{todos.length - completedCount}</h2>
            </div>
          </div>
        </section>

        <section className="todo-panel">
          <div className="panel-heading">
            <div>
              <h2>My tasks</h2>
              <p className="muted">Your tasks, your progress.</p>
            </div>
          </div>

          <TodoForm onAdd={addTodo} loading={adding} />

          {error && (
            <div className="error-message" role="alert">
              {error}
              {error.includes("load") && (
                <button className="text-button" onClick={fetchTodos}>
                  Retry
                </button>
              )}
            </div>
          )}

          <div className="filter-tabs">
            {["all", "active", "completed"].map((item) => (
              <button
                key={item}
                className={filter === item ? "filter-tab selected" : "filter-tab"}
                onClick={() => setFilter(item)}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="empty-state">Loading your tasks...</div>
          ) : filteredTodos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✓</div>
              <h3>
                {filter === "all"
                  ? "Your list is ready"
                  : `No ${filter} tasks`}
              </h3>
              <p>
                {filter === "all"
                  ? "Add your first task above and get started."
                  : "Try another filter or add a new task."}
              </p>
            </div>
          ) : (
            <div className="todo-list">
              {filteredTodos.map((todo) => (
                <TodoItem
                  key={todo._id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                  busy={busyIds.includes(todo._id)}
                />
              ))}
            </div>
          )}
          
        </section>

        <p className="dashboard-footer">
          One task at a time. Keep moving forward.
        </p>
      </main>
    </div>
  );
}

export default Todo;