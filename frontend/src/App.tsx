import { Link, RouterProvider, createBrowserRouter, Outlet, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import Projects from "./pages/projects/projects";
import Tasks from "./pages/tasks/tasks";
import Users from "./pages/users/users";
import Register from "./pages/register/register";
import Login from "./pages/login/login";
import Button from "./components/button/button";
import ProtectedRoute from "./components/protectedRoute/protectedRoute";
import auth, { logout, userKey } from "./services/authService";
import { Role } from "./enums";

import styles from "./App.module.css";

function App() {
  const user = auth.getLocalUser();

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem(userKey);
      window.location.href = "/";
    } catch {
      toast.error("Logout failed. Please try again.");
    }
  };

  const Layout = () => (
    <>
      <nav className={styles.nav}>
        <div className={styles.left}>
          <Link to="/">Projects</Link>
          {user?.role === Role.ADMIN && "|"}
          {user?.role === Role.ADMIN && <Link to="/users">Users</Link>}
        </div>
        <div className={styles.right}>
          {!user ? (
            <>
              <Link to="/register">Register</Link>|<Link to="/login">Login</Link>
            </>
          ) : (
            <>
              <span>{`${user.email} ${user.role === Role.ADMIN ? "(Admin)" : ""}`}</span>
              <Button onClick={handleLogout}>Logout</Button>
            </>
          )}
        </div>
      </nav>
      <Outlet />
    </>
  );

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Projects user={user} /> },
        {
          path: "projects/:projectId",
          element: (
            <ProtectedRoute requiredRoles={[Role.USER, Role.ADMIN]} currentRole={user?.role}>
              <Tasks user={user} />
            </ProtectedRoute>
          ),
        },
        {
          path: "users",
          element: (
            <ProtectedRoute requiredRoles={[Role.ADMIN]} currentRole={user?.role}>
              <Users user={user} />
            </ProtectedRoute>
          ),
        },
        {
          path: "register",
          element: user ? <Navigate to="/" replace /> : <Register />,
        },
        {
          path: "login",
          element: user ? <Navigate to="/" replace /> : <Login />,
        },
        {
          path: "*",
          element: <Navigate to="/" replace />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
