import { FormEvent, useState } from "react";
import { loginAdmin, forgotPassword, resetPassword } from "../../services/api";
import { Key, Mail, Lock } from "lucide-react";

interface AdminLoginProps {
  onLogin: (token: string, username: string) => void;
  onBack: () => void;
}

export default function AdminLogin({ onLogin, onBack }: AdminLoginProps) {
  const [mode, setMode] = useState<"login" | "forgot" | "reset">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const data = await loginAdmin(username.trim(), password);
      onLogin(data.token, data.username);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const data = await forgotPassword(username.trim());
      setResetCode(data.resetCode);
      setMessage(`Reset code generated: ${data.resetCode}. Use it below to create a new password.`);
      setMode("reset");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to start password reset.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await resetPassword(username.trim(), resetCode.trim(), newPassword);
      setMessage("Password reset successfully. You can now log in.");
      setMode("login");
      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setResetCode("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F10] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-[#141416]/90 p-8 shadow-2xl shadow-black/20">
        <div className="mb-8 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-[#D4AF37]">Admin Access</p>
            <h1 className="mt-3 text-3xl font-bold">Control Panel</h1>
          </div>
          <button
            onClick={onBack}
            className="rounded-full bg-white/10 px-3 py-2 text-sm text-gray-200 hover:bg-white/15"
          >
            Back
          </button>
        </div>

        {mode === "login" && (
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Username</label>
              <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-[#0F0F10]/50 px-4 py-3">
                <Lock className="h-5 w-5 text-[#D4AF37]" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-transparent text-white outline-none"
                  placeholder="admin"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Password</label>
              <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-[#0F0F10]/50 px-4 py-3">
                <Key className="h-5 w-5 text-[#D4AF37]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-white outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>
            {message && <p className="text-sm text-amber-300">{message}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#E5E4E2] px-6 py-3 text-sm font-semibold text-[#0F0F10] transition hover:brightness-110 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("forgot");
                setMessage("");
              }}
              className="w-full rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-gray-200 hover:bg-white/5"
            >
              Forgot Password
            </button>
          </form>
        )}

        {mode === "forgot" && (
          <form onSubmit={handleForgot} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Username</label>
              <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-[#0F0F10]/50 px-4 py-3">
                <Mail className="h-5 w-5 text-[#D4AF37]" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-transparent text-white outline-none"
                  placeholder="admin"
                />
              </div>
            </div>
            {message && <p className="text-sm text-amber-300">{message}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#E5E4E2] px-6 py-3 text-sm font-semibold text-[#0F0F10] transition hover:brightness-110 disabled:opacity-50"
            >
              {loading ? "Sending reset code..." : "Request Reset Code"}
            </button>
            <button
              type="button"
              onClick={() => setMode("login")}
              className="w-full rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-gray-200 hover:bg-white/5"
            >
              Back to Login
            </button>
          </form>
        )}

        {mode === "reset" && (
          <form onSubmit={handleReset} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Username</label>
              <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-[#0F0F10]/50 px-4 py-3">
                <Lock className="h-5 w-5 text-[#D4AF37]" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-transparent text-white outline-none"
                  placeholder="admin"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Reset Code</label>
              <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-[#0F0F10]/50 px-4 py-3">
                <Key className="h-5 w-5 text-[#D4AF37]" />
                <input
                  type="text"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  className="w-full bg-transparent text-white outline-none"
                  placeholder="Enter reset code"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-300">New Password</label>
              <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-[#0F0F10]/50 px-4 py-3">
                <Key className="h-5 w-5 text-[#D4AF37]" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-transparent text-white outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Confirm Password</label>
              <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-[#0F0F10]/50 px-4 py-3">
                <Key className="h-5 w-5 text-[#D4AF37]" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-transparent text-white outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>
            {message && <p className="text-sm text-amber-300">{message}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#E5E4E2] px-6 py-3 text-sm font-semibold text-[#0F0F10] transition hover:brightness-110 disabled:opacity-50"
            >
              {loading ? "Resetting password..." : "Reset Password"}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setMessage("");
              }}
              className="w-full rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-gray-200 hover:bg-white/5"
            >
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
