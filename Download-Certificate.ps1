# Ignore SSL certificate errors
Add-Type @"
    using System.Net;
    using System.Security.Cryptography.X509Certificates;
    public class TrustAllCertsPolicy : ICertificatePolicy {
        public bool CheckValidationResult(
            ServicePoint srvPoint, X509Certificate certificate,
            WebRequest request, int certificateProblem) {
            return true;
        }
    }
"@
[System.Net.ServicePointManager]::CertificatePolicy = New-Object TrustAllCertsPolicy

# Download the certificate
$webClient = New-Object System.Net.WebClient
$webClient.DownloadFile("https://localhost:8081/_explorer/emulator.pem", "emulatorcert.pem")
