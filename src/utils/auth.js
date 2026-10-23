
 // Shared validation + hashing helpers for the mock auth layer.

export const MIN_PASSWORD_LENGTH = 6;
export const USERNAME_MIN = 2;
export const USERNAME_MAX = 30;

export const normalizeEmail = (email = "") =>
  email.trim().toLowerCase();

export const isValidEmail = (email = "") =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

/** Returns an error message, or null when the name is valid. */
export function validateUsername(name = "") {
  const trimmed = name.trim();

  if (!trimmed) return "Name is required.";

  if (trimmed.length < USERNAME_MIN) {
    return `Name must be at least ${USERNAME_MIN} characters.`;
  }

  if (trimmed.length > USERNAME_MAX) {
    return `Name must be ${USERNAME_MAX} characters or fewer.`;
  }

  return null;
}

/** Returns an error message, or null when the password is valid. */
export function validatePassword(password = "") {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  return null;
}

/**
 * Hash a password with SHA-256.
 * This is a frontend demo only, not production authentication.
 */
export async function hashPassword(password) {
  const bytes = new TextEncoder().encode(`aura-fitness:${password}`);

  if (window.crypto?.subtle) {
    const digest = await window.crypto.subtle.digest("SHA-256", bytes);

    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  // Fallback for environments without crypto.subtle.
  return `plain:${password}`;
}
