# Sustainability Intelligence

From signals to opportunities.

Sustainability Intelligence is an India-anchored, globally informed intelligence product that finds credible developments, explains their relevance to India and identifies practical pathways to funding, partnerships, consulting, connection and action.

## Current implementation

This repository contains the approved public front page, verified-email access interface and persistent private workspace foundation.

- Light editorial visual identity
- Fiery Terracotta, Ivory, Graphite, Crayola Blue and Dodger Blue
- Wordmark with the initial "I" in "INTELLIGENCE" set in Fiery Terracotta
- Approved front-page narrative
- Separate Individual Expert Fit and Nonprofit Fit
- Six-digit passwordless email verification through Supabase Auth
- Per-user workspace state protected by Postgres Row Level Security
- Responsive navigation and accessible interaction states
- No private keys or SMTP credentials in browser or repository files

## Production activation

Production access remains safely disabled until the project owner creates the free Supabase and Resend services and adds the two safe GitHub deployment variables.

Follow [the verified access setup guide](docs/verified-access-setup.md). Never place a Supabase secret key, service role key, SMTP password or Resend API key in this repository.

## Review mode

Use `access.html?review=1` to review the complete access interface without sending email or creating an account. Use the demonstration code `123456`.

Use `workspace.html?review=1` to review the illustrative workspace without a production session. The records in the interface are format demonstrations, not live intelligence.

## Local dependencies

None for the deployed product. The interface is plain HTML, CSS and JavaScript and is deployed through GitHub Pages. GitHub Actions installs Playwright only inside the visual-review runner.
