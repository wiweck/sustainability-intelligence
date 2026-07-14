# Verified access setup

This repository contains the approved browser interface and database protections. Production access remains safely disabled until the project owner completes the following vendor account and domain steps.

## 1. Create the Supabase project

1. Create a free project at [Supabase](https://supabase.com/).
2. Open the SQL editor.
3. Copy and run [database/schema.sql](../database/schema.sql).
4. Confirm that the four tables appear: `profiles`, `intelligence_items`, `workspace_states` and `account_requests`.
5. Confirm that Row Level Security is enabled on every table.

## 2. Configure six-digit email codes

1. In Supabase, open Authentication, then Email Templates.
2. Edit the Magic Link template so the message clearly presents the code.
3. Use `{{ .Token }}` in the template. Do not use only `{{ .ConfirmationURL }}`.
4. Keep the code time limited and keep email sign-up enabled.
5. Add the production GitHub Pages URL to the allowed site URLs.

## 3. Configure delivery through Resend

The default Supabase email sender is intended only for testing and has restrictive limits. Production use needs custom SMTP.

1. Create a free [Resend](https://resend.com/) account.
2. Add and verify a sending domain that you control.
3. Create an SMTP credential in Resend.
4. In Supabase, open Authentication, then SMTP Settings.
5. Enter the Resend SMTP host, port, username and password.
6. Send test codes to an address you control.
7. Keep SMTP credentials only in Supabase. Never place them in this repository or browser code.

## 4. Add safe deployment variables

In GitHub, open this repository, then Settings, Secrets and variables, Actions, Variables. Add:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`

Use the Supabase project URL and publishable key. A publishable key is designed for browser use and remains constrained by Row Level Security.

Never add a secret key, service role key, SMTP password or Resend API key to the site, source files or GitHub variables exposed to the browser.

The Pages workflow writes the two safe values into `supabase-config.js` only inside the deployment artifact. If either value is absent, the access page stops safely and collects nothing.

## 5. Verify before enabling access

1. Open the deployed access page.
2. Request a code using a test email.
3. Confirm the email contains a six-digit code.
4. Verify the code and confirm the private workspace opens.
5. Refresh and confirm the session remains active.
6. Save and track two sample records, refresh again and confirm the state remains.
7. Sign out and confirm the workspace redirects to verified access.
8. Sign in as a different test user and confirm the first user's saved state is not visible.
9. Submit a data export request and confirm one pending row is created for that user.
10. Confirm an unauthenticated request cannot read any of the four tables.
11. Review the automated access screenshots attached to the pull request workflow.

## Free-tier operating limits

The planned services are Supabase Free and Resend Free. As of this implementation record:

- Supabase Free includes 50,000 monthly active users, a 500 MB database, 5 GB egress and 1 GB storage.
- A Supabase free project may pause after one week without activity.
- Resend Free includes 3,000 emails per month and a daily sending limit of 100.

Stay within the free plans. If a limit is approached, pause new access and review usage before changing any plan. Do not enable a paid plan without a separate approval.

## Review mode

Append `?review=1` to `access.html` to inspect the interface without sending email or creating an account. The demonstration code is `123456`. Review mode never establishes a production session and is not a substitute for the production checklist.
