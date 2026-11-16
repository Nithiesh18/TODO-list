import { useNavigate } from "react-router-dom";
import logo from '../assets/Stylized Checklist Icon with Pencil.jpeg';

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <header className="navbar">
      <div className="nav-brand">
        <img src={logo} className="logo"/>
        <span>TODO TASKS</span>
      </div>

      <div className="nav-user">
        <div className="avatar">
          {user?.username?.charAt(0).toUpperCase() || "U"}
        </div>

        <span className="nav-username">
          {user?.username || "User"}
        </span>

        <button className="logout-button" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </header>
  );
}

export default Navbar;