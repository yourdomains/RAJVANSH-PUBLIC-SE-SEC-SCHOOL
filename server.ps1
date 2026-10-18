# ===================================================================
# RAJVANSH 3D WEBSITE - HIGH SPEED LOCALHOST HTTP SERVER
# ===================================================================
param(
    [int]$Port = 3000,
    [string]$RootDir = $PSScriptRoot
)

$ErrorActionPreference = "Stop"

if (-not $RootDir) {
    $RootDir = (Get-Location).Path
}

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  RAJVANSH PUBLIC SENIOR SECONDARY SCHOOL - 3D WEBSITE" -ForegroundColor Yellow
Write-Host "  High Performance Localhost Web Server" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " Root Directory : $RootDir" -ForegroundColor Gray
Write-Host " Target URL     : http://localhost:$Port/" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan

$csharp = @'
using System;
using System.IO;
using System.Net;
using System.Text;
using System.Threading;
using System.Collections.Generic;

public class WebServer3D
{
    private readonly HttpListener _listener = new HttpListener();
    private readonly string _rootDir;
    private readonly int _port;
    private volatile bool _running;

    private static readonly Dictionary<string, string> MimeMap = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
    {
        { ".html", "text/html; charset=utf-8" },
        { ".htm",  "text/html; charset=utf-8" },
        { ".css",  "text/css; charset=utf-8" },
        { ".js",   "application/javascript; charset=utf-8" },
        { ".json", "application/json; charset=utf-8" },
        { ".png",  "image/png" },
        { ".jpg",  "image/jpeg" },
        { ".jpeg", "image/jpeg" },
        { ".webp", "image/webp" },
        { ".gif",  "image/gif" },
        { ".svg",  "image/svg+xml" },
        { ".ico",  "image/x-icon" },
        { ".woff", "font/woff" },
        { ".woff2","font/woff2" },
        { ".ttf",  "font/ttf" },
        { ".mp3",  "audio/mpeg" },
        { ".wav",  "audio/wav" }
    };

    public WebServer3D(string rootDir, int port)
    {
        _rootDir = Path.GetFullPath(rootDir);
        _port = port;
        _listener.Prefixes.Add("http://localhost:" + port + "/");
        _listener.Prefixes.Add("http://127.0.0.1:" + port + "/");
    }

    public void Start()
    {
        _running = true;
        _listener.Start();

        Thread loop = new Thread(() =>
        {
            while (_running)
            {
                try
                {
                    HttpListenerContext context = _listener.GetContext();
                    ThreadPool.QueueUserWorkItem(ctx => ProcessRequest((HttpListenerContext)ctx), context);
                }
                catch (HttpListenerException) { if (!_running) break; }
                catch (Exception) { if (!_running) break; }
            }
        });
        loop.IsBackground = true;
        loop.Start();
    }

    public void Stop()
    {
        _running = false;
        try { _listener.Stop(); } catch {}
    }

    private void ProcessRequest(HttpListenerContext context)
    {
        HttpListenerRequest req = context.Request;
        HttpListenerResponse res = context.Response;

        res.Headers["Access-Control-Allow-Origin"] = "*";
        res.Headers["Server"] = "Rajvansh-3D-LocalServer";
        res.Headers["Cache-Control"] = "no-cache";

        try
        {
            string urlPath = req.Url.AbsolutePath.TrimStart('/');
            if (string.IsNullOrEmpty(urlPath)) urlPath = "index.html";

            string filePath = Path.Combine(_rootDir, urlPath.Replace('/', Path.DirectorySeparatorChar));

            if (!File.Exists(filePath))
            {
                res.StatusCode = 404;
                byte[] notFound = Encoding.UTF8.GetBytes("<h1>404 - File Not Found</h1><p>" + urlPath + "</p>");
                res.ContentType = "text/html; charset=utf-8";
                res.ContentLength64 = notFound.Length;
                if (req.HttpMethod != "HEAD")
                {
                    res.OutputStream.Write(notFound, 0, notFound.Length);
                }
                res.Close();
                return;
            }

            string ext = Path.GetExtension(filePath);
            string mime;
            if (!MimeMap.TryGetValue(ext, out mime)) mime = "application/octet-stream";

            res.ContentType = mime;
            res.StatusCode = 200;

            byte[] bytes = File.ReadAllBytes(filePath);
            res.ContentLength64 = bytes.Length;

            if (req.HttpMethod != "HEAD")
            {
                res.OutputStream.Write(bytes, 0, bytes.Length);
            }
            res.Close();
        }
        catch (Exception ex)
        {
            try
            {
                res.StatusCode = 500;
                byte[] err = Encoding.UTF8.GetBytes("500 Server Error: " + ex.Message);
                res.ContentLength64 = err.Length;
                if (req.HttpMethod != "HEAD")
                {
                    res.OutputStream.Write(err, 0, err.Length);
                }
                res.Close();
            }
            catch {}
        }
    }
}
'@

Add-Type -TypeDefinition $csharp -Language CSharp

$server = New-Object WebServer3D -ArgumentList $RootDir, $Port
$server.Start()

Write-Host ""
Write-Host ">>> SERVER IS LIVE AND LISTENING! <<<" -ForegroundColor Green
Write-Host "Open your browser at:" -ForegroundColor White
Write-Host "  -> http://localhost:$Port/" -ForegroundColor Yellow
Write-Host "  -> http://127.0.0.1:$Port/" -ForegroundColor Yellow
Write-Host ""

# Keep running
while ($true) {
    Start-Sleep -Seconds 1
}
