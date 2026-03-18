param()

$ErrorActionPreference = "Stop"

function Write-Step {
  param([string]$Message)
  Write-Host ""
  Write-Host "==> $Message" -ForegroundColor Cyan
}

function Get-RequiredEnv {
  param([string]$Name)

  $value = [Environment]::GetEnvironmentVariable($Name)

  if ([string]::IsNullOrWhiteSpace($value)) {
    throw "Missing environment variable: $Name"
  }

  return $value
}

$tablesToCheck = @(
  "roles",
  "membership_tiers",
  "profiles",
  "posts",
  "comments",
  "products",
  "events",
  "event_participants",
  "activities"
)

$seedChecks = @(
  @{
    Label = "roles"
    Sql = "select name from public.roles order by name;"
  },
  @{
    Label = "membership_tiers"
    Sql = "select name from public.membership_tiers order by name;"
  }
)

$projectRef = Get-RequiredEnv "PROJECT_REF"
$accessToken = Get-RequiredEnv "SUPABASE_ACCESS_TOKEN"

$headers = @{
  Authorization = "Bearer $accessToken"
  "Content-Type" = "application/json"
}

Write-Step "Checking required tables"

foreach ($table in $tablesToCheck) {
  $uri = "https://api.supabase.com/v1/projects/$projectRef/database/query"
  $body = @{ query = "select to_regclass('public.$table') as table_name;" } | ConvertTo-Json
  $result = Invoke-RestMethod -Uri $uri -Method POST -Headers $headers -Body $body

  if (-not $result.table_name -and -not $result[0].table_name) {
    throw "Table check failed: public.$table not found"
  }

  Write-Host "OK: public.$table"
}

Write-Step "Checking seeded data"

foreach ($seedCheck in $seedChecks) {
  $body = @{ query = $seedCheck.Sql } | ConvertTo-Json
  $result = Invoke-RestMethod `
    -Uri "https://api.supabase.com/v1/projects/$projectRef/database/query" `
    -Method POST `
    -Headers $headers `
    -Body $body

  Write-Host ""
  Write-Host $seedCheck.Label -ForegroundColor Yellow
  $result | Format-Table
}

Write-Step "Core schema verification complete"
