import { useState } from "react";

function TodoForm({ onAdd, loading }) {
  const [title, setTitle] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    const success = await onAdd(title.trim());

    if (success) {
      setTitle("");
    }
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Discipline today, freedom tomorrow."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={200}
        required
      />

      <button className="primary-button add-button" disabled={loading}>
        {loading ? "Adding..." : "+ Add task"}
      </button>
    </form>
  );
}

export default TodoForm;