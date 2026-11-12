# High-Performance Synchronous Local HTTP Server (Pure 7-bit ASCII, No Admin Needed)
$ErrorActionPreference = "Continue"

# 1. Determine directory safely in Unicode
$dir = $PSScriptRoot
if (-not $dir) { $dir = (Get-Location).Path }

# 2. Local environment ready
$dstModel = [System.IO.Path]::Combine($dir, "model")

# 3. Start TcpListener on Loopback (127.0.0.1 never requires Admin rights or http.sys ACLs)
$port = 8000
$tcp = $null

foreach ($p in @(8000, 8080, 8888, 9000)) {
    try {
        $ip = [System.Net.IPAddress]::Parse("127.0.0.1")
        $l = New-Object System.Net.Sockets.TcpListener($ip, $p)
        $l.Start()
        $tcp = $l
        $port = $p
        break
    } catch {
        $tcp = $null
    }
}

if (-not $tcp) {
    Write-Host "[ERROR] Could not start TCP listener on port 8000 or 8080." -ForegroundColor Red
    Write-Host "Please check if another application is using port 8000." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

$url = "http://127.0.0.1:$port/model.html"
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  SMART GREENHOUSE 3D LOCAL SERVER IS RUNNING!" -ForegroundColor Green
Write-Host "  Address: $url" -ForegroundColor Yellow
Write-Host "  Opening browser automatically..." -ForegroundColor Cyan
Write-Host "  DO NOT CLOSE THIS CONSOLE while exploring the 3D model!" -ForegroundColor Magenta
Write-Host "============================================================" -ForegroundColor Cyan

# 4. Open browser automatically
try {
    Start-Process $url
} catch {}

# 5. Handle HTTP requests synchronously and reliably
$buf = New-Object byte[] 65536

while ($true) {
    $client = $null
    try {
        $client = $tcp.AcceptTcpClient()
        $stream = $client.GetStream()
        $reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::ASCII)

        $reqLine = $reader.ReadLine()
        if (-not $reqLine) {
            $client.Close()
            continue
        }

        # Read HTTP headers until empty line
        $rangeHeader = $null
        while ($true) {
            $h = $reader.ReadLine()
            if (-not $h -or $h.Trim() -eq "") { break }
            if ($h -match "^(?i)Range:\s*bytes=(.+)") {
                $rangeHeader = $matches[1].Trim()
            }
        }

        $tokens = $reqLine.Split(" ")
        if ($tokens.Length -lt 2) {
            $client.Close()
            continue
        }

        $method = $tokens[0].ToUpper()
        $path = $tokens[1]
        if ($path.Contains("?")) { $path = $path.Substring(0, $path.IndexOf("?")) }
        if ($path.Contains("#")) { $path = $path.Substring(0, $path.IndexOf("#")) }

        $rel = [System.Uri]::UnescapeDataString($path.TrimStart('/'))
        if (-not $rel -or $rel -eq "") { $rel = "model.html" }
        $rel = $rel.Replace('/', [System.IO.Path]::DirectorySeparatorChar)

        $full = [System.IO.Path]::Combine($dir, $rel)

        if ([System.IO.File]::Exists($full)) {
            $ext = [System.IO.Path]::GetExtension($full).ToLower()
            $mime = "application/octet-stream"
            switch ($ext) {
                ".html" { $mime = "text/html; charset=utf-8" }
                ".htm"  { $mime = "text/html; charset=utf-8" }
                ".css"  { $mime = "text/css; charset=utf-8" }
                ".js"   { $mime = "application/javascript; charset=utf-8" }
                ".json" { $mime = "application/json; charset=utf-8" }
                ".glb"  { $mime = "model/gltf-binary" }
                ".gltf" { $mime = "model/gltf+json" }
                ".obj"  { $mime = "text/plain; charset=utf-8" }
                ".mtl"  { $mime = "text/plain; charset=utf-8" }
                ".png"  { $mime = "image/png" }
                ".jpg"  { $mime = "image/jpeg" }
                ".jpeg" { $mime = "image/jpeg" }
                ".svg"  { $mime = "image/svg+xml" }
                ".mp4"  { $mime = "video/mp4" }
            }

            $fileLen = (New-Object System.IO.FileInfo($full)).Length
            $isRange = $false
            $start = [int64]0
            $end = $fileLen - 1

            if ($rangeHeader) {
                if ($rangeHeader -match "^(\d+)-(\d*)$") {
                    $start = [int64]$matches[1]
                    if ($matches[2] -ne "") {
                        $end = [int64]$matches[2]
                    } else {
                        $end = $fileLen - 1
                    }
                    if ($end -ge $fileLen) { $end = $fileLen - 1 }
                    if ($start -le $end -and $start -lt $fileLen) {
                        $isRange = $true
                    }
                } elseif ($rangeHeader -match "^-(\d+)$") {
                    $suffixLen = [int64]$matches[1]
                    $start = [Math]::Max([int64]0, $fileLen - $suffixLen)
                    $end = $fileLen - 1
                    $isRange = $true
                }
            }

            if ($isRange) {
                $contentLen = ($end - $start) + 1
                $hdr = "HTTP/1.1 206 Partial Content`r`n" +
                       "Content-Type: $mime`r`n" +
                       "Content-Range: bytes $start-$end/$fileLen`r`n" +
                       "Content-Length: $contentLen`r`n" +
                       "Accept-Ranges: bytes`r`n" +
                       "Access-Control-Allow-Origin: *`r`n" +
                       "Connection: close`r`n`r`n"

                $hdrBytes = [System.Text.Encoding]::ASCII.GetBytes($hdr)
                $stream.Write($hdrBytes, 0, $hdrBytes.Length)

                if ($method -ne "HEAD") {
                    $fs = $null
                    try {
                        $fs = [System.IO.File]::Open($full, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
                        $fs.Seek($start, [System.IO.SeekOrigin]::Begin) | Out-Null
                        $bytesLeft = $contentLen
                        while ($bytesLeft -gt 0) {
                            $chunkSize = [Math]::Min([int64]$buf.Length, $bytesLeft)
                            $read = $fs.Read($buf, 0, [int]$chunkSize)
                            if ($read -le 0) { break }
                            $stream.Write($buf, 0, $read)
                            $bytesLeft -= $read
                        }
                    } finally {
                        if ($fs) { $fs.Dispose() }
                    }
                }
                Write-Host "  [206 Partial Content] $rel ($start-$end/$fileLen)" -ForegroundColor Cyan
            } else {
                $hdr = "HTTP/1.1 200 OK`r`n" +
                       "Content-Type: $mime`r`n" +
                       "Content-Length: $fileLen`r`n" +
                       "Accept-Ranges: bytes`r`n" +
                       "Access-Control-Allow-Origin: *`r`n" +
                       "Connection: close`r`n`r`n"

                $hdrBytes = [System.Text.Encoding]::ASCII.GetBytes($hdr)
                $stream.Write($hdrBytes, 0, $hdrBytes.Length)

                if ($method -ne "HEAD") {
                    $fs = $null
                    try {
                        $fs = [System.IO.File]::Open($full, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
                        while (($read = $fs.Read($buf, 0, $buf.Length)) -gt 0) {
                            $stream.Write($buf, 0, $read)
                        }
                    } finally {
                        if ($fs) { $fs.Dispose() }
                    }
                }
                Write-Host "  [200 OK] $rel" -ForegroundColor Green
            }
        } else {
            $notFound = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $rel")
            $hdr = "HTTP/1.1 404 Not Found`r`n" +
                   "Content-Type: text/plain; charset=utf-8`r`n" +
                   "Content-Length: " + $notFound.Length + "`r`n" +
                   "Access-Control-Allow-Origin: *`r`n" +
                   "Connection: close`r`n`r`n"
            $hdrBytes = [System.Text.Encoding]::ASCII.GetBytes($hdr)
            $stream.Write($hdrBytes, 0, $hdrBytes.Length)
            $stream.Write($notFound, 0, $notFound.Length)
            Write-Host "  [404 NOT FOUND] $rel" -ForegroundColor Yellow
        }

        $stream.Flush()
        $client.Close()
    } catch {
        if ($client) {
            try { $client.Close() } catch {}
        }
    }
}
