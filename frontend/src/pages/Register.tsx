import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { register } from "../api/auth";
import { User } from "../types/User";

export default function Register() {
  const [user, setUser] = useState<User>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "Student",
  });
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validatePassword = (pw: string): string[] => {
    const errors: string[] = [];
    if (pw.length < 6) errors.push("Must be at least 6 characters long.");
    if (!/[A-Z]/.test(pw)) errors.push("Must include at least one uppercase letter.");
    if (!/[0-9]/.test(pw)) errors.push("Must include at least one digit.");
    if (!/[^a-zA-Z0-9]/.test(pw)) errors.push("Must include at least one special character.");
    return errors;
  };

  const validateEmail = (email: string): string => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email) ? "" : "Please enter a valid email address.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailError = validateEmail(user.email);
    if (emailError) {
      alert(emailError);
      return;
    }
    const errors = validatePassword(user.password);
    setPasswordErrors(errors);

    if (errors.length > 0) return;

    try {
      await register(user);
      navigate("/login");
    } catch (error) {
      const AxiosError = error as AxiosError;
      if (AxiosError.response?.status === 400) {
        alert("Email already exists. Please use a different email.");
      } else {
        alert("Registration failed");
      }
    }
  };

  return (
    <div className="container">
      <h2>Sign Up for a new account</h2>
      <p style={{ marginTop: "1rem", color: "#ccc" }}>
        Already have an account?{" "}
        <a href="/login" style={{ color: "#4d8cff" }}>
          Sign In
        </a>
      </p>
      <form className="form" onSubmit={handleSubmit}>
        <input name="firstName" value={user.firstName} onChange={handleChange} placeholder="First Name" />
        <input name="lastName" value={user.lastName} onChange={handleChange} placeholder="Last Name" />
        <select name="role" value={user.role} onChange={handleChange}>
          <option value="Student">Student</option>
          <option value="Teacher">Teacher</option>
        </select>
        <input name="email" value={user.email} onChange={handleChange} placeholder="Email" />
        <input
          name="password"
          type="password"
          value={user.password}
          onChange={(e) => {
            const value = e.target.value;
            setUser((prev) => ({ ...prev, password: value }));
            setPasswordErrors(validatePassword(value));
          }}
          placeholder="Password"
        />
        {passwordErrors.length > 0 && (
          <ul style={{ color: "red", fontSize: "0.9rem", paddingLeft: "1rem" }}>
            {passwordErrors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        )}
        <button type="submit" className="submit">
          Register
        </button>
      </form>
    </div>
  );
}
