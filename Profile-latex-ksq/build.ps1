[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$sourceRoot = Join-Path $projectRoot 'src'
$buildRoot = Join-Path $projectRoot 'build'
$outputRoot = Join-Path $projectRoot 'output\pdf'
$outputPdf = Join-Path $outputRoot 'ksq-cv.pdf'

$xelatexCommand = Get-Command 'xelatex.exe' -ErrorAction SilentlyContinue
if ($null -ne $xelatexCommand) {
    $xelatexPath = $xelatexCommand.Source
}
else {
    $xelatexPath = Join-Path $env:LOCALAPPDATA 'Programs\MiKTeX\miktex\bin\x64\xelatex.exe'
}
if (-not (Test-Path -LiteralPath $xelatexPath -PathType Leaf)) {
    throw 'XeLaTeX was not found. Install MiKTeX or add xelatex.exe to PATH.'
}

New-Item -ItemType Directory -Force -Path $buildRoot, $outputRoot | Out-Null
Push-Location $sourceRoot
try {
    1..2 | ForEach-Object {
        & $xelatexPath --interaction=nonstopmode --halt-on-error --file-line-error `
            "--output-directory=$buildRoot" '.\main.tex'
        if ($LASTEXITCODE -ne 0) { throw "XeLaTeX compilation pass $_ failed." }
    }
}
finally {
    Pop-Location
}

Copy-Item -LiteralPath (Join-Path $buildRoot 'main.pdf') -Destination $outputPdf -Force
Write-Host "Built: $outputPdf"
