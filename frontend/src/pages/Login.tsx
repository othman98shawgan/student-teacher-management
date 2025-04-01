import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);
  const { login: authLogin } = useAuth(); // rename to avoid conflict

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await login({ email, password });
      authLogin(token);
      const role = getRoleFromToken(token);
      navigate(role === "Teacher" ? "/teacher" : "/student");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  const getRoleFromToken = (token: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded = jwtDecode(token) as any;
    return decoded.role;
  };

  return (
    <div>
      <div className="container">
        {/* <h1>Student and Teacher Management System</h1> */}
        <h2>Sign In to your account</h2>
        <p className="subtext">
          Or <a href="/register">Create a new account</a>
        </p>
        <form className="form" onSubmit={handleLogin}>
          <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="toggle-password" onClick={togglePassword} role="button" title="Toggle password visibility">
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
          <button type="submit" className="submit">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
