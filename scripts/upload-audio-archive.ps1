# Uploads the 2015-2020 audio sermons to the Internet Archive item that the
# archive page plays from (src/data/audioArchive.ts). Uses archive.org's
# S3-style API with curl.exe, so no Python is needed.
#
# 1. Sign in to archive.org as the church account and open
#    https://archive.org/account/s3.php to see the "S3 access key" and "secret".
# 2. In a PowerShell window, from the ctc-app folder, run:
#      powershell -ExecutionPolicy Bypass -File scripts\upload-audio-archive.ps1
#    and paste the two keys when asked. They are used only for this run.
#
# Safe to run again: files already in the item are skipped, so an interrupted
# upload picks up where it stopped.

param(
  [string]$Folder = "C:\Church Website\old-site-archive\audio-sermons",
  [string]$Identifier = "ctc-audio-sermons-2015-2020"
)

$ErrorActionPreference = "Stop"

$access = $env:IA_ACCESS_KEY
$secret = $env:IA_SECRET_KEY
if (-not $access) { $access = Read-Host "archive.org S3 access key" }
if (-not $secret) {
  $secure = Read-Host "archive.org S3 secret key" -AsSecureString
  $secret = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure))
}

$files = Get-ChildItem -LiteralPath $Folder -Filter *.mp3 | Sort-Object Name
if (-not $files) { throw "No MP3s found in $Folder" }

# What is already uploaded (an empty answer means the item does not exist yet).
$existing = @{}
$itemExists = $false
try {
  $meta = Invoke-RestMethod "https://archive.org/metadata/$Identifier"
  if ($meta.files) {
    $itemExists = $true
    foreach ($f in $meta.files) { $existing[$f.name] = [int64]$f.size }
  }
} catch {
  Write-Warning "Could not read the item's current files; uploading everything."
}

# Item metadata, sent with the first upload that creates the item.
# Header values must be plain ASCII.
$metaHeaders = @(
  "x-amz-auto-make-bucket:1",
  "x-archive-meta-mediatype:audio",
  "x-archive-meta-collection:opensource_audio",
  "x-archive-meta-title:Christ Tamil Church Chicago - Audio Sermons 2015-2020",
  "x-archive-meta-creator:Christ Tamil Church Chicago",
  "x-archive-meta-language:tam",
  "x-archive-meta01-subject:sermons",
  "x-archive-meta02-subject:Tamil",
  "x-archive-meta03-subject:Christian",
  "x-archive-meta04-subject:Chicago",
  "x-archive-meta-date:2015-2020",
  "x-archive-meta-description:Sunday sermons from Christ Tamil Church in Downers Grove, Illinois, recorded 2015 to 2020, mostly in Tamil. Listen with the full list of themes and speakers at https://christtamilchurch.com/sermons/audio-archive/"
)

$total = $files.Count
$done = 0
$failed = @()
foreach ($file in $files) {
  $done++
  if ($existing.ContainsKey($file.Name) -and $existing[$file.Name] -eq $file.Length) {
    Write-Host "[$done/$total] already uploaded  $($file.Name)"
    continue
  }

  $mb = [math]::Round($file.Length / 1MB, 1)
  Write-Host "[$done/$total] uploading ($mb MB)  $($file.Name)"
  $curlArgs = @(
    "--silent", "--show-error", "--fail", "--location",
    "--retry", "5", "--retry-delay", "20",
    "--header", "authorization: LOW ${access}:${secret}",
    "--header", "x-archive-size-hint:$($file.Length)",
    "--upload-file", $file.FullName,
    "https://s3.us.archive.org/$Identifier/$([uri]::EscapeDataString($file.Name))"
  )
  if (-not $itemExists) {
    foreach ($h in $metaHeaders) { $curlArgs = @("--header", $h) + $curlArgs }
  }

  & curl.exe @curlArgs | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Write-Warning "Failed: $($file.Name) (curl exit $LASTEXITCODE)"
    $failed += $file.Name
    continue
  }
  # The first successful upload creates the item; later ones just add files.
  $itemExists = $true
}

Write-Host ""
if ($failed.Count) {
  Write-Warning "$($failed.Count) file(s) failed. Run the script again to retry just those:"
  $failed | ForEach-Object { Write-Host "  $_" }
} else {
  Write-Host "All $total recordings are on archive.org."
}
Write-Host "Item page: https://archive.org/details/$Identifier"
Write-Host "New items can take a few hours to appear while archive.org processes them."
