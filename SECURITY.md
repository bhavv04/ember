# Security Policy

## Supported versions

Only the latest version of Ember is actively maintained.

| Version | Supported |
|---|---|
| latest (`main`) | ✅ |
| older branches | ❌ |

## Reporting a vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

If you discover a security issue, email **security@ember.app** with:

- A description of the vulnerability
- Steps to reproduce it
- The potential impact
- Any suggested fixes if you have them

You'll receive a response within 48 hours. If the issue is confirmed, a fix will be prioritized and you'll be credited in the release notes unless you prefer otherwise.

## Scope

In scope:
- Authentication and session handling
- Data access controls — users accessing other users' data
- API route authorization
- Injection vulnerabilities

Out of scope:
- Theoretical attacks with no practical impact
- Issues in third-party services (Clerk, Neon, Vercel) — report those directly to the vendor
- Rate limiting on non-sensitive endpoints

## Third-party services

Ember uses the following third-party services. Report vulnerabilities in these directly to their security teams:

- **Clerk** — [clerk.com/security](https://clerk.com/security)
- **Neon** — [neon.tech/security](https://neon.tech/security)
- **Vercel** — [vercel.com/security](https://vercel.com/security)