# Secure Coding Rules & Guidelines

> **Purpose**: Standard security constraints and guidelines for code generated and maintained in this workspace.

---

## 1. Input Handling & Injection Prevention

- **XSS Prevention (Cross-Site Scripting)**:
  - Avoid raw HTML injection (`innerHTML`, `dangerouslySetInnerHTML`) with dynamic user inputs.
  - When rendering markdown or rich text, always use vetted, sanitized AST pipelines or text node bindings.
  - Rely on React's automatic JSX escaping for text interpolation.
- **Command Injection Prevention**:
  - Never concatenate variables into shell execution strings.
  - Use structured argument arrays (`spawn`, `execFile`) instead of shell-interpolated execution (`exec`) in automation scripts.
  - Ban runtime dynamic code evaluation (`eval()`, `new Function()`, `setTimeout(string)`).
- **SQL & Query Safety**:
  - Always use parameterized queries or type-safe ORM query builders.
  - Never construct database queries via raw string interpolation.

---

## 2. Secrets & Credential Management

- **Zero Hardcoded Secrets**:
  - Never commit API keys, access tokens, credentials, connection strings, or private certificates to version control.
  - Always use environment variables (`.env`, `process.env`, `import.meta.env`).
  - Maintain a sanitized `.env.example` file for onboarding and documentation.
- **Log Sanitation**:
  - Never log passwords, tokens, full session objects, or PII (Personally Identifiable Information) in console output or log files.
  - Mask sensitive fields before logging error objects.

---

## 3. Client-Side Data & Storage Integrity

- **Safe Deserialization**:
  - Always wrap `JSON.parse()` of `localStorage`, `sessionStorage`, or cookie values in `try-catch` blocks with safe default fallbacks.
  - Validate shapes of client-persisted data to avoid crashes from corrupted or manually modified storage state.
- **Least Privilege Storage**:
  - Do not store sensitive authentication tokens (like refresh tokens) in unencrypted `localStorage` where they are vulnerable to XSS; prefer HTTP-only, secure, SameSite cookies when backends are used.

---

## 4. Dependencies & Supply Chain Security

- **Vulnerability Auditing**:
  - Regularly verify dependencies using `npm audit` or equivalent tooling.
  - Pin versions via `package-lock.json` and review new third-party packages before installation.
- **Minimal Surface**:
  - Prefer native Web APIs and standard library utilities over pulling in unneeded single-purpose dependencies.
  - Avoid running untrusted third-party scripts via remote curl-piping.

---

## 5. Network & Transport Security

- **Enforce Encrypted Transport**:
  - Ensure all external API requests and asset loading use `https://`.
- **CORS & Headers**:
  - Configure strict Cross-Origin Resource Sharing (CORS) allowlists on servers.
  - Enforce Content-Security-Policy (CSP), `X-Content-Type-Options: nosniff`, and `X-Frame-Options: DENY` where applicable.
