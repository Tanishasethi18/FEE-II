// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import Layout from "../components/Layout";
// import Button from "../components/Button";
// import Input from "../components/Input";
// import { useAuth } from "../context/AuthContext";

// export default function Register() {
//   const { register } = useAuth();
//   const navigate = useNavigate();

//   const [form, setForm] = useState({ username: "", email: "", password: "" });
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((f) => ({ ...f, [name]: value }));
//   };

//   const validate = () => {
//     const nextErrors = {};
//     if (!form.username.trim()) nextErrors.username = "Name is required.";
//     if (!form.email.trim()) nextErrors.email = "Email is required.";
//     if (!form.password || form.password.length < 6)
//       nextErrors.password = "Password must be at least 6 characters.";
//     setErrors(nextErrors);
//     return Object.keys(nextErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;
//     setIsSubmitting(true);
//     try {
//       await register({ username: form.username, email: form.email });
//       navigate("/home", { replace: true });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Layout>
//       <section className="max-w-content mx-auto px-container-padding lg:px-container-padding-lg py-16 lg:py-24 flex justify-center">
//         <div className="w-full max-w-md">
//           <h1 className="font-display text-headline-lg-mobile text-on-surface mb-2 text-center">
//             Create your account.
//           </h1>
//           <p className="font-body text-body-md text-on-surface-variant text-center mb-10">
//             Join Aura Fitness in under a minute.
//           </p>

//           <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
//             <Input
//               id="username"
//               name="username"
//               type="text"
//               label="Full name"
//               placeholder="Tanisha Verma"
//               value={form.username}
//               onChange={handleChange}
//               error={errors.username}
//               autoComplete="name"
//             />
//             <Input
//               id="email"
//               name="email"
//               type="email"
//               label="Email"
//               placeholder="you@example.com"
//               value={form.email}
//               onChange={handleChange}
//               error={errors.email}
//               autoComplete="email"
//             />
//             <Input
//               id="password"
//               name="password"
//               type="password"
//               label="Password"
//               placeholder="At least 6 characters"
//               value={form.password}
//               onChange={handleChange}
//               error={errors.password}
//               autoComplete="new-password"
//             />
//             <Button
//               type="submit"
//               variant="primary"
//               size="lg"
//               disabled={isSubmitting}
//               className="mt-2 w-full"
//             >
//               {isSubmitting ? "Creating account…" : "Sign up"}
//             </Button>
//           </form>

//           <p className="font-body text-body-sm text-on-surface-variant text-center mt-8">
//             Already have an account?{" "}
//             <Link to="/login" className="text-on-surface underline underline-offset-4">
//               Login
//             </Link>
//           </p>
//         </div>
//       </section>
//     </Layout>
//   );
// }

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Button from "../components/Button";
import Input from "../components/Input";
import FormMessage from "../components/FormMessage";
import { useAuth } from "../context/AuthContext";
import { isValidEmail, validatePassword, validateUsername } from "../utils/auth";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const nextErrors = {};
    const nameError = validateUsername(form.username);
    if (nameError) nextErrors.username = nameError;
    if (!form.email.trim()) nextErrors.email = "Email is required.";
    else if (!isValidEmail(form.email)) nextErrors.email = "Enter a valid email address.";
    const passwordError = validatePassword(form.password);
    if (passwordError) nextErrors.password = passwordError;
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await register(form);
      navigate("/home", { replace: true });
    } catch (err) {
      setFormError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <section className="max-w-content mx-auto px-container-padding lg:px-container-padding-lg py-16 lg:py-24 flex justify-center">
        <div className="w-full max-w-md">
          <h1 className="font-display text-headline-lg-mobile text-on-surface mb-2 text-center">
            Create your account.
          </h1>
          <p className="font-body text-body-md text-on-surface-variant text-center mb-10">
            Join Aura Fitness in under a minute.
          </p>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <FormMessage tone="error">{formError}</FormMessage>
            <Input id="username" name="username" type="text" label="Full name" placeholder="Tanisha Verma"
              value={form.username} onChange={handleChange} error={errors.username} autoComplete="name" />
            <Input id="email" name="email" type="email" label="Email" placeholder="you@example.com"
              value={form.email} onChange={handleChange} error={errors.email} autoComplete="email" />
            <Input id="password" name="password" type="password" label="Password" placeholder="At least 6 characters"
              value={form.password} onChange={handleChange} error={errors.password} autoComplete="new-password" />
            <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="mt-2 w-full">
              {isSubmitting ? "Creating account…" : "Sign up"}
            </Button>
          </form>

          <p className="font-body text-body-sm text-on-surface-variant text-center mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-on-surface underline underline-offset-4">
              Login
            </Link>
          </p>
        </div>
      </section>
    </Layout>
  );
}