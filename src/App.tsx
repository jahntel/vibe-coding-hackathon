import React, { useState, useEffect } from 'react';
import { Shield, Search, AlertTriangle, CheckCircle, Globe, Lock, ShieldCheck, History, FileText, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface ScanResult {
  url: string;
  timestamp: number;
  safe: boolean;
  threats: string[];
  details: {
    protocol: string;
    domain: string;
    responseTime: number;
    certificates?: {
      valid: boolean;
      issuer?: string;
      expiryDate?: string;
    };
  };
}

function App() {
  const [url, setUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [history, setHistory] = useState<ScanResult[]>(() => {
    const saved = localStorage.getItem('scan-history');
    return saved ? JSON.parse(saved) : [];
  });
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    localStorage.setItem('scan-history', JSON.stringify(history));
  }, [history]);

  const performSecurityChecks = (url: string) => {
    const threats: string[] = [];
    const urlObj = new URL(url);
    
    // Protocol check
    if (!url.startsWith('https://')) {
      threats.push('Insecure connection (non-HTTPS)');
    }

    // Domain checks
    if (url.includes('malware') || url.includes('virus')) {
      threats.push('Potential malware detected');
    }
    
    // Suspicious TLD check
    const suspiciousTLDs = ['.xyz', '.tk', '.ml', '.ga', '.cf'];
    if (suspiciousTLDs.some(tld => url.endsWith(tld))) {
      threats.push('Suspicious top-level domain detected');
    }

    // Length check
    if (url.length > 100) {
      threats.push('Unusually long URL detected');
    }

    // Special character check
    if (/[<>'"%;()&+]/.test(url)) {
      threats.push('Suspicious special characters detected');
    }

    return {
      threats,
      details: {
        protocol: urlObj.protocol,
        domain: urlObj.hostname,
        responseTime: Math.random() * 100 + 50, // Simulated response time
        certificates: url.startsWith('https://') ? {
          valid: true,
          issuer: 'DigiCert Inc',
          expiryDate: format(new Date().setFullYear(new Date().getFullYear() + 1), 'yyyy-MM-dd')
        } : undefined
      }
    };
  };

  const scanUrl = async () => {
    setScanning(true);
    try {
      // Simulated API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const { threats, details } = performSecurityChecks(url);
      
      const scanResult: ScanResult = {
        url,
        timestamp: Date.now(),
        safe: threats.length === 0,
        threats,
        details
      };

      setResult(scanResult);
      setHistory(prev => [scanResult, ...prev].slice(0, 10));
    } catch (error) {
      setResult({
        url,
        timestamp: Date.now(),
        safe: false,
        threats: ['Invalid URL format'],
        details: {
          protocol: 'unknown',
          domain: 'unknown',
          responseTime: 0
        }
      });
    }
    setScanning(false);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('scan-history');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <header className="p-6 border-b border-slate-700">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-emerald-400" />
            <h1 className="text-2xl font-bold">Shield Web Guard</h1>
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 px-4 py-2 rounded bg-slate-700 hover:bg-slate-600"
          >
            <History className="w-5 h-5" />
            {showHistory ? 'Hide History' : 'Show History'}
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Protect Your Online Safety</h2>
            <p className="text-slate-300">Advanced security scanning and threat detection</p>
          </div>

          <div className="bg-slate-800 p-6 rounded-lg shadow-xl mb-8">
            <div className="flex gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL to scan..."
                className="flex-1 px-4 py-2 rounded bg-slate-700 border border-slate-600 focus:outline-none focus:border-emerald-400"
              />
              <button
                onClick={scanUrl}
                disabled={scanning || !url}
                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-600 rounded font-medium flex items-center gap-2"
              >
                {scanning ? (
                  <>
                    <Search className="animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Search />
                    Scan URL
                  </>
                )}
              </button>
            </div>
          </div>

          {result && (
            <div className={`bg-slate-800 p-6 rounded-lg shadow-xl mb-8 ${result.safe ? 'border-2 border-emerald-500' : 'border-2 border-red-500'}`}>
              <div className="flex items-center gap-3 mb-4">
                {result.safe ? (
                  <>
                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                    <h3 className="text-xl font-bold text-emerald-400">URL is Safe</h3>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-8 h-8 text-red-400" />
                    <h3 className="text-xl font-bold text-red-400">Threats Detected</h3>
                  </>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-700 p-4 rounded">
                  <h4 className="font-semibold mb-2">URL Details</h4>
                  <p className="text-sm text-slate-300">Protocol: {result.details.protocol}</p>
                  <p className="text-sm text-slate-300">Domain: {result.details.domain}</p>
                  <p className="text-sm text-slate-300">Response Time: {result.details.responseTime.toFixed(2)}ms</p>
                </div>

                {result.details.certificates && (
                  <div className="bg-slate-700 p-4 rounded">
                    <h4 className="font-semibold mb-2">SSL Certificate</h4>
                    <p className="text-sm text-slate-300">Status: {result.details.certificates.valid ? 'Valid' : 'Invalid'}</p>
                    <p className="text-sm text-slate-300">Issuer: {result.details.certificates.issuer}</p>
                    <p className="text-sm text-slate-300">Expires: {result.details.certificates.expiryDate}</p>
                  </div>
                )}
              </div>

              {!result.safe && (
                <div className="bg-red-500/10 p-4 rounded">
                  <h4 className="font-semibold mb-2">Detected Threats</h4>
                  <ul className="list-disc list-inside text-red-300">
                    {result.threats.map((threat, index) => (
                      <li key={index}>{threat}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {showHistory && history.length > 0 && (
            <div className="bg-slate-800 p-6 rounded-lg shadow-xl mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <History className="w-6 h-6" />
                  Scan History
                </h3>
                <button
                  onClick={clearHistory}
                  className="text-red-400 hover:text-red-300 flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear
                </button>
              </div>
              <div className="space-y-4">
                {history.map((scan, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded ${scan.safe ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {scan.safe ? (
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                      )}
                      <span className="font-medium">{scan.url}</span>
                    </div>
                    <div className="text-sm text-slate-400">
                      Scanned: {format(scan.timestamp, 'PPpp')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-slate-800 p-6 rounded-lg text-center">
              <Globe className="w-8 h-8 mx-auto mb-4 text-blue-400" />
              <h3 className="text-lg font-bold mb-2">URL Scanning</h3>
              <p className="text-slate-300">Deep analysis of web addresses for potential threats</p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg text-center">
              <Lock className="w-8 h-8 mx-auto mb-4 text-purple-400" />
              <h3 className="text-lg font-bold mb-2">SSL Verification</h3>
              <p className="text-slate-300">Certificate validation and security protocol checks</p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg text-center">
              <FileText className="w-8 h-8 mx-auto mb-4 text-emerald-400" />
              <h3 className="text-lg font-bold mb-2">Detailed Reports</h3>
              <p className="text-slate-300">Comprehensive security analysis and threat detection</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;