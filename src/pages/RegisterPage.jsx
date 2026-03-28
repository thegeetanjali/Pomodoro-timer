import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import Card from "../components/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email) e.email = "Email is required";
    if (form.password.length < 6) e.password = "Minimum 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success("Account created! Let's focus 🍅");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 flex items-center justify-center p-4">
      <Card className="max-w-sm">
        <div className="text-4xl mb-4">🍅</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Create account</h1>
        <p className="text-gray-400 text-sm mb-8">Start tracking your focus sessions</p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <Input label="Name" type="text" placeholder="Your name"
            value={form.name} onChange={set("name")} error={errors.name} />
          <Input label="Email" type="email" placeholder="you@example.com"
            value={form.email} onChange={set("email")} error={errors.email} />
          <Input label="Password" type="password" placeholder="Min. 6 characters"
            value={form.password} onChange={set("password")} error={errors.password} />
          <Button loading={loading} type="submit">Create Account</Button>
        </form>

        <p className="text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-rose-500 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
