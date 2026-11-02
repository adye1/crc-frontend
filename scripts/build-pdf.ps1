# Regenerates site/Adam-Dye-Resume.pdf from site/index.html using the page's print stylesheet.
# Run after any content change:  powershell -File scripts/build-pdf.ps1
$root = Split-Path -Parent $PSScriptRoot
$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$html = (Resolve-Path "$root\site\index.html").Path
$pdf  = Join-Path $root "site\Adam-Dye-Resume.pdf"
& $edge --headless --disable-gpu --no-pdf-header-footer "--print-to-pdf=$pdf" "file:///$($html -replace '\','/')"
Start-Sleep -Seconds 3
if (Test-Path $pdf) { Write-Host "Wrote $pdf" } else { Write-Error "PDF not created" }
