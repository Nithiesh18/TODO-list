function TodoItem({ todo, onToggle, onDelete, busy }) {
  return (
    <div className={`todo-item ${todo.completed ? "is-completed" : ""}`}>
      <label className="todo-check">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo)}
          disabled={busy}
          aria-label={`Mark ${todo.title} ${
            todo.completed ? "incomplete" : "complete"
          }`}
        />

        <span className="custom-checkbox">
          {todo.completed ? "✓" : ""}
        </span>
      </label>

      <span className="todo-title">{todo.title}</span>

      <span className="todo-status">
        {todo.completed ? "Completed" : "Pending"}
      </span>

      <button
        className="delete-button"
        onClick={() => onDelete(todo._id)}
        disabled={busy}
        aria-label={`Delete ${todo.title}`}
        title="Delete task"
      >
        Delete
      </button>
    </div>
  );
}

export default TodoItem;