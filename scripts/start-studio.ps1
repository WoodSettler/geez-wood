$ErrorActionPreference = 'Stop'
$RepoRoot = Split-Path -Parent $PSScriptRoot
$Port = 4321
$StudioUrl = "http://127.0.0.1:$Port/studio"

$Host.UI.RawUI.WindowTitle = 'Geez Wood Studio (关闭此窗口即停止本地后台)'

function Test-PortOpen {
  param([int]$P)
  try {
    $c = New-Object System.Net.Sockets.TcpClient
    $iar = $c.BeginConnect('127.0.0.1', $P, $null, $null)
    $ok = $iar.AsyncWaitHandle.WaitOne(200, $false)
    if ($ok -and $c.Connected) { $c.Close(); return $true }
    $c.Close()
  } catch {}
  return $false
}

Set-Location $RepoRoot

if (Test-PortOpen -P $Port) {
  Write-Host "Geez Wood 本地后台已在运行，直接打开浏览器：$StudioUrl" -ForegroundColor Green
  Start-Process $StudioUrl
  Start-Sleep -Seconds 2
  exit 0
}

# 工作区干净时顺手拉一次远端最新（避免自动周报等远端更新造成后续冲突）
$dirty = git status --porcelain 2>$null
if (-not $dirty) {
  Write-Host "正在同步远端最新提交..." -ForegroundColor DarkGray
  git pull --ff-only origin main 2>$null | Out-Null
}

Write-Host "正在启动 Geez Wood 本地写作工作台 ($StudioUrl)..." -ForegroundColor Cyan
Write-Host "提示：写完后可在网页右上角点「发布上线」；不使用时直接关闭本窗口即可。" -ForegroundColor DarkGray
Write-Host ""

# 后台等端口就绪后自动打开默认浏览器
Start-Job -ScriptBlock {
  param($p, $url)
  for ($i = 0; $i -lt 40; $i++) {
    try {
      $c = New-Object System.Net.Sockets.TcpClient
      $iar = $c.BeginConnect('127.0.0.1', $p, $null, $null)
      if ($iar.AsyncWaitHandle.WaitOne(250, $false) -and $c.Connected) {
        $c.Close()
        Start-Process $url
        break
      }
      $c.Close()
    } catch {}
    Start-Sleep -Milliseconds 300
  }
} -ArgumentList $Port, $StudioUrl | Out-Null

npm run dev
