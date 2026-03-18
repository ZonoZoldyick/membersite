# Supabase Auth Debug Settings

Temporary auth settings used during local debugging.

## Current Temporary Setting

- `mailer_autoconfirm = true`

This disables email confirmation during signup so local testing can proceed without waiting for confirmation links.

## Revert After Debugging

Set `mailer_autoconfirm` back to `false`.

PowerShell example:

```powershell
$headers = @{
  Authorization = "Bearer $env:SUPABASE_ACCESS_TOKEN"
  "Content-Type" = "application/json"
}

$body = @{
  mailer_autoconfirm = $false
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "https://api.supabase.com/v1/projects/$env:PROJECT_REF/config/auth" `
  -Method PATCH `
  -Headers $headers `
  -Body $body
```

## Confirm Current Setting

PowerShell example:

```powershell
$headers = @{
  Authorization = "Bearer $env:SUPABASE_ACCESS_TOKEN"
}

Invoke-RestMethod `
  -Uri "https://api.supabase.com/v1/projects/$env:PROJECT_REF/config/auth" `
  -Method GET `
  -Headers $headers
```

Check:

- `mailer_autoconfirm = true` during debugging
- `mailer_autoconfirm = false` after debugging

## Operational Note

- Keep this enabled only for local debugging
- Re-enable email confirmation before production or external testing
