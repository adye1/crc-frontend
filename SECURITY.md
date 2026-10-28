# Security policy

This repository holds a personal resume site (adamdye.dev). It is a static site plus a small Cloudflare Worker, so the attack surface is small, but reports are welcome.

## Reporting a vulnerability

Email **adamsdye@outlook.com** with a description and steps to reproduce. Please do not open a public issue for a security problem. I aim to acknowledge reports within a few days.

## Scope

In scope: the site at https://adamdye.dev, the Worker in `edge/`, and the GitHub Actions workflows in this repository.

Out of scope: denial-of-service testing, automated high-volume scanning, social engineering, and anything affecting third-party services (Azure, Cloudflare, GitHub).

## Controls in place

- Passwordless deployment: GitHub Actions authenticates to Azure with OIDC; no cloud credentials are stored in the repository.
- Strict Content-Security-Policy, HSTS, and other security headers set at the edge.
- CodeQL, secret scanning with push protection, and Dependabot on every change.
- GitHub Actions pinned to commit SHAs.
- Signed commits required on `main`.
- DNSSEC on the domain, plus SPF, DKIM, and DMARC records that reject all mail claiming to come from it.
