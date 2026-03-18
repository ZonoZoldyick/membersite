param(
  [string[]]$MigrationFiles = @(
    "database/migrations/001_initial_schema.sql",
    "database/migrations/003_auth_profile_trigger.sql",
    "database/migrations/004_activities.sql"
  )
)

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

function Get-MigrationChunks {
  param(
    [string]$MigrationFile,
    [string]$Sql
  )

  if ($MigrationFile -ne "database/migrations/001_initial_schema.sql") {
    return @($Sql)
  }

  $rolesInsertMarker = "insert into public.roles (name, description)"
  $rlsMarker = "alter table public.roles enable row level security;"
  $indexesMarker = "create index if not exists idx_profiles_role_id on public.profiles (role_id);"

  $rolesInsertIndex = $Sql.IndexOf($rolesInsertMarker)
  $rlsIndex = $Sql.IndexOf($rlsMarker)
  $indexesIndex = $Sql.IndexOf($indexesMarker)

  if ($rolesInsertIndex -lt 0 -or $rlsIndex -lt 0 -or $indexesIndex -lt 0) {
    throw "Could not split 001_initial_schema.sql into manageable chunks."
  }

  $chunk1 = $Sql.Substring(0, $rolesInsertIndex)
  $chunk2 = $Sql.Substring($rolesInsertIndex, $rlsIndex - $rolesInsertIndex)
  $chunk3 = $Sql.Substring($rlsIndex, $indexesIndex - $rlsIndex)
  $chunk4 = $Sql.Substring($indexesIndex)

  return @($chunk1, $chunk2, $chunk3, $chunk4)
}

$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Resolve-Path (Join-Path $scriptDirectory "..")

Set-Location $projectRoot

$projectRef = Get-RequiredEnv "PROJECT_REF"
$accessToken = Get-RequiredEnv "SUPABASE_ACCESS_TOKEN"

$headers = @{
  Authorization = "Bearer $accessToken"
  "Content-Type" = "application/json"
}

foreach ($migrationFile in $MigrationFiles) {
  $resolvedPath = Resolve-Path $migrationFile
  $sql = Get-Content -Path $resolvedPath -Raw
  $chunks = Get-MigrationChunks -MigrationFile $migrationFile -Sql $sql

  for ($index = 0; $index -lt $chunks.Count; $index++) {
    Write-Step "Applying $migrationFile (chunk $($index + 1)/$($chunks.Count))"

    $body = @{
      query = $chunks[$index]
    } | ConvertTo-Json -Depth 5

    Invoke-RestMethod `
      -Uri "https://api.supabase.com/v1/projects/$projectRef/database/query" `
      -Method POST `
      -Headers $headers `
      -Body $body | Out-Null
  }
}

Write-Step "Core schema migrations applied"
