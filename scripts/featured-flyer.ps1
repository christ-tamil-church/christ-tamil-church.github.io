# Installs a new featured-event flyer into its fixed slot.
#
#   powershell -ExecutionPolicy Bypass -File scripts/featured-flyer.ps1 "C:\path\to\flyer.jpg"
#
# Writes three files that src/data/images.ts already imports, so swapping the
# weekly flyer never touches code:
#   src/assets/images/featured-event-flyer.jpg       (up to 1600px wide)
#   src/assets/images/featured-event-flyer-800.jpg   (800px wide, for phones)
#   src/assets/images/featured-event-flyer.json      (pixel size, for layout)
# Then update the event's details in `featuredEvent` (src/data/site.ts).
param(
  [Parameter(Mandatory = $true)][string]$Source
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$outDir = Join-Path $PSScriptRoot "..\src\assets\images"
$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
  Where-Object { $_.MimeType -eq "image/jpeg" }

function Save-Resized([System.Drawing.Image]$image, [int]$maxWidth, [string]$path) {
  $width = [Math]::Min($maxWidth, $image.Width)
  $height = [int][Math]::Round($image.Height * $width / $image.Width)
  $bitmap = New-Object System.Drawing.Bitmap($width, $height)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $graphics.DrawImage($image, 0, 0, $width, $height)

  $params = New-Object System.Drawing.Imaging.EncoderParameters(1)
  $params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
    [System.Drawing.Imaging.Encoder]::Quality, [long]84)
  $bitmap.Save($path, $jpegCodec, $params)

  $graphics.Dispose()
  $bitmap.Dispose()
  return @{ width = $width; height = $height }
}

$image = [System.Drawing.Image]::FromFile((Resolve-Path $Source))
try {
  $large = Save-Resized $image 1600 (Join-Path $outDir "featured-event-flyer.jpg")
  Save-Resized $image 800 (Join-Path $outDir "featured-event-flyer-800.jpg") | Out-Null
} finally {
  $image.Dispose()
}

$size = "{`"width`": $($large.width), `"height`": $($large.height)}"
[System.IO.File]::WriteAllText((Join-Path $outDir "featured-event-flyer.json"), $size + "`n")
Write-Host "Featured flyer installed: $($large.width) x $($large.height). Now update featuredEvent in src/data/site.ts."
