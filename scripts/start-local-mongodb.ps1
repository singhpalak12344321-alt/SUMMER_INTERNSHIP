$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$mongoSearchPaths = @(
  (Join-Path $root "work\mongodb-extracted"),
  (Join-Path $root "..\work\mongodb-extracted")
)

$mongod = $mongoSearchPaths |
  Where-Object { Test-Path $_ } |
  ForEach-Object { Get-ChildItem -Path $_ -Filter "mongod.exe" -Recurse } |
  Select-Object -First 1 -ExpandProperty FullName

if (-not $mongod) {
  throw "mongod.exe was not found. Extract MongoDB into work\mongodb-extracted first."
}

$dataPath = Join-Path $root "work\mongo-data"
$logPath = Join-Path $root "work\mongo-log"
New-Item -ItemType Directory -Force -Path $dataPath, $logPath | Out-Null

$existing = Get-Process mongod -ErrorAction SilentlyContinue
if ($existing) {
  Write-Host "MongoDB is already running on this machine."
  Wait-Process -Id $existing[0].Id
  exit 0
}

& $mongod --dbpath $dataPath --bind_ip 127.0.0.1 --port 27017 --logpath (Join-Path $logPath "mongod.log") --logappend
