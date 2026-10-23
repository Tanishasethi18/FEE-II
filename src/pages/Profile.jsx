// import Layout from "../components/Layout";
// import Avatar from "../components/Avatar";
// import Button from "../components/Button";
// import Icon from "../components/Icon";
// import { useAuth } from "../context/AuthContext";
// import { useBookings } from "../context/BookingContext";

// const MENU_ITEMS = [
//   { icon: "event_available", label: "My Bookings", to: "/bookings" },
//   { icon: "calendar_today", label: "My Schedule", to: "/schedule" },
//   { icon: "fitness_center", label: "Browse Classes", to: "/classes" },
// ];

// export default function Profile() {
//   const { user, logout } = useAuth();
//   const { clearBookings } = useBookings();

// const handleLogout = () => {
//   logout();
//   clearBookings();
// };

//   return (
//     <Layout>
//       <section className="max-w-content mx-auto px-container-padding lg:px-container-padding-lg pt-12 pb-16 flex flex-col items-center">
//         <Avatar username={user?.username} size="xl" className="mb-6" />
//         <h1 className="font-display text-headline-lg-mobile text-on-surface mb-1">
//           {user?.username}
//         </h1>
//         {user?.email && (
//           <p className="font-body text-body-md text-on-surface-variant mb-10">
//             {user.email}
//           </p>
//         )}

//         <div className="w-full max-w-md flex flex-col gap-3 mb-10">
//           {MENU_ITEMS.map((item) => (
//             <Button
//               key={item.to}
//               to={item.to}
//               variant="secondary"
//               size="lg"
//               className="!justify-start w-full"
//             >
//               <Icon name={item.icon} size={20} />
//               {item.label}
//             </Button>
//           ))}
//         </div>

//         <Button
//           variant="ghost"
//           size="md"
//           onClick={handleLogout}
//           className="text-error"
//         >
//           Log out
//         </Button>
//       </section>
//     </Layout>
//   );
// }
import { useState } from "react";
import Layout from "../components/Layout";
import Avatar from "../components/Avatar";
import Button from "../components/Button";
import Icon from "../components/Icon";
import Input from "../components/Input";
import FormMessage from "../components/FormMessage";
import { useAuth } from "../context/AuthContext";
import { useBookings } from "../context/BookingContext";
import { useTheme } from "../context/ThemeContext";
import { USERNAME_MAX } from "../utils/auth";

const LINKS = [
  { icon: "event_available", label: "My Bookings", to: "/bookings" },
  { icon: "calendar_today", label: "My Schedule", to: "/schedule" },
  { icon: "fitness_center", label: "Browse Classes", to: "/classes" },
  { icon: "rate_review", label: "Send Feedback", to: "/feedback" },
];

const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: "light_mode" },
  { value: "dark", label: "Dark", icon: "dark_mode" },
];

function formatMemberSince(iso) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

/** Shared card shell so every settings block looks the same. */
function Section({ title, description, children }) {
  return (
    <section className="bg-surface-container-lowest border border-surface-container-highest rounded-2xl p-6">
      <h2 className="font-display text-headline-sm text-on-surface">{title}</h2>
      {description && (
        <p className="font-body text-body-sm text-on-surface-variant mt-1">{description}</p>
      )}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function Profile() {
  const { user, logout, updateUsername, changePassword } = useAuth();
  const { bookedIds, clearBookings } = useBookings();
  const { theme, setTheme } = useTheme();

  /* ------------------------------ username edit ----------------------------- */
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [nameError, setNameError] = useState("");
  const [nameSuccess, setNameSuccess] = useState("");
  const [isSavingName, setIsSavingName] = useState(false);

  const startEditingName = () => {
    setNameDraft(user?.username ?? "");
    setNameError("");
    setNameSuccess("");
    setIsEditingName(true);
  };

  const cancelEditingName = () => {
    setIsEditingName(false);
    setNameError("");
  };

  const handleSaveName = async (e) => {
    e.preventDefault();
    setNameError("");
    setIsSavingName(true);
    try {
      await updateUsername(nameDraft);
      setIsEditingName(false);
      setNameSuccess("Username updated.");
    } catch (err) {
      setNameError(err.message);
    } finally {
      setIsSavingName(false);
    }
  };

  /* ----------------------------- password change ---------------------------- */
  const emptyPasswordForm = { current: "", next: "", confirm: "" };
  const [passwordForm, setPasswordForm] = useState(emptyPasswordForm);
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordMessage, setPasswordMessage] = useState({ tone: "", text: "" });
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((f) => ({ ...f, [name]: value }));
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage({ tone: "", text: "" });

    const nextErrors = {};
    if (!passwordForm.current) nextErrors.current = "Enter your current password.";
    if (!passwordForm.next) nextErrors.next = "Enter a new password.";
    if (passwordForm.confirm !== passwordForm.next) nextErrors.confirm = "Passwords don't match.";
    setPasswordErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSavingPassword(true);
    try {
      await changePassword({
        currentPassword: passwordForm.current,
        newPassword: passwordForm.next,
      });
      setPasswordForm(emptyPasswordForm);
      setPasswordMessage({ tone: "success", text: "Password updated." });
    } catch (err) {
      setPasswordMessage({ tone: "error", text: err.message });
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleLogout = () => {
    logout();
    clearBookings();
  };

  const memberSince = formatMemberSince(user?.createdAt);

  return (
    <Layout>
      <div className="max-w-content mx-auto px-container-padding lg:px-container-padding-lg pt-12 pb-16">
        {/* Identity header */}
        <div className="flex flex-col items-center text-center mb-10">
          <Avatar username={user?.username} size="xl" className="mb-6" />
          <h1 className="font-display text-headline-lg-mobile text-on-surface mb-1 break-words max-w-full">
            {user?.username}
          </h1>
          {user?.email && (
            <p className="font-body text-body-md text-on-surface-variant break-all">{user.email}</p>
          )}
          {memberSince && (
            <p className="font-body text-body-sm text-on-surface-variant mt-1">
              Member since {memberSince}
            </p>
          )}
        </div>

        

          {/* Username */}
          <Section title="Profile" description="This is the name shown across Aura Fitness.">
            {isEditingName ? (
              <form onSubmit={handleSaveName} noValidate className="flex flex-col gap-4">
                <Input
                  id="username"
                  name="username"
                  label="Username"
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  error={nameError}
                  maxLength={USERNAME_MAX}
                  autoComplete="name"
                  autoFocus
                />
                <div className="flex gap-3">
                  <Button type="submit" variant="primary" size="md" disabled={isSavingName}>
                    {isSavingName ? "Saving…" : "Save"}
                  </Button>
                  <Button type="button" variant="ghost" size="md" onClick={cancelEditingName}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-body text-label-sm text-on-surface-variant mb-1">USERNAME</p>
                    <p className="font-body text-body-md text-on-surface truncate">{user?.username}</p>
                  </div>
                  <Button type="button" variant="secondary" size="sm" onClick={startEditingName}>
                    <span className="w-4 h-4 overflow-hidden inline-flex items-center justify-center">
                      <Icon name="edit" size={16} />
                    </span>
                    Edit
                  </Button>
                </div>
                <div className="min-w-0">
                  <p className="font-body text-label-sm text-on-surface-variant mb-1">EMAIL</p>
                  <p className="font-body text-body-md text-on-surface break-all">{user?.email}</p>
                </div>
                <FormMessage tone="success">{nameSuccess}</FormMessage>
              </div>
            )}
          </Section>

          {/* Appearance */}
          <Section title="Appearance" description="Choose how Aura Fitness looks on this device.">
            <div className="grid grid-cols-2 gap-3" role="group" aria-label="Theme">
              {THEME_OPTIONS.map((option) => {
                const isActive = theme === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setTheme(option.value)}
                    aria-pressed={isActive}
                    className={`flex items-center justify-center gap-2 rounded-full px-4 py-3 font-body text-label-sm transition-all duration-200 active:scale-[0.98] ${
                      isActive
                        ? "bg-primary text-on-primary"
                        : "bg-surface-container-low text-on-surface border border-surface-container-highest hover:bg-surface-container"
                    }`}
                  >
                    <span className="w-5 h-5 overflow-hidden inline-flex items-center justify-center">
                      <Icon name={option.icon} size={18} />
                    </span>
                    {option.label}
                  </button>
                );
              })}
            </div>
          </Section>

          {/* Password */}
          <Section title="Password" description="Use at least 6 characters.">
            <form onSubmit={handleSavePassword} noValidate className="flex flex-col gap-4">
              <FormMessage tone={passwordMessage.tone || "info"}>{passwordMessage.text}</FormMessage>
              <Input
                id="current-password"
                name="current"
                type="password"
                label="Current password"
                value={passwordForm.current}
                onChange={handlePasswordChange}
                error={passwordErrors.current}
                autoComplete="current-password"
              />
              <Input
                id="new-password"
                name="next"
                type="password"
                label="New password"
                value={passwordForm.next}
                onChange={handlePasswordChange}
                error={passwordErrors.next}
                autoComplete="new-password"
              />
              <Input
                id="confirm-password"
                name="confirm"
                type="password"
                label="Confirm new password"
                value={passwordForm.confirm}
                onChange={handlePasswordChange}
                error={passwordErrors.confirm}
                autoComplete="new-password"
              />
              <div>
                <Button type="submit" variant="primary" size="md" disabled={isSavingPassword}>
                  {isSavingPassword ? "Updating…" : "Update password"}
                </Button>
              </div>
            </form>
          </Section>

          {/* Quick links */}
          <div className="flex flex-col gap-3">
            {LINKS.map((item) => (
              <Button
                key={item.to}
                to={item.to}
                variant="secondary"
                size="lg"
                className="!justify-start w-full"
              >
                <span className="w-5 h-5 overflow-hidden inline-flex items-center justify-center">
                  <Icon name={item.icon} size={20} />
                </span>
                {item.label}
              </Button>
            ))}
          </div>

          <div className="flex justify-center">
            <Button variant="ghost" size="md" onClick={handleLogout} className="text-error">
              Log out
            </Button>
          </div>
        </div>
      
    </Layout>
  );
}