import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Button from "../components/Button";
import Input from "../components/Input";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/home";

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.email.trim()) nextErrors.email = "Email is required.";
    if (!form.password) nextErrors.password = "Password is required.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      // Derive a display username from the email until a real backend
      // returns a proper profile name.
      const username = form.email.split("@")[0];
      await login({ username, email: form.email });
      navigate(redirectTo, { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <section className="max-w-content mx-auto px-container-padding lg:px-container-padding-lg py-16 lg:py-24 flex justify-center">
        <div className="w-full max-w-md">
          <h1 className="font-display text-headline-lg-mobile text-on-surface mb-2 text-center">
            Welcome back.
          </h1>
          <p className="font-body text-body-md text-on-surface-variant text-center mb-10">
            Login to book your next class.
          </p>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              autoComplete="email"
            />
            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="current-password"
            />
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              className="mt-2 w-full"
            >
              {isSubmitting ? "Logging in…" : "Login"}
            </Button>
          </form>

          <p className="font-body text-body-sm text-on-surface-variant text-center mt-8">
            Don't have an account?{" "}
            <Link to="/register" className="text-on-surface underline underline-offset-4">
              Sign up
            </Link>
          </p>
        </div>
      </section>
    </Layout>
  );
}
