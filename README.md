# Shield Web Guard 🛡️

A powerful web security tool that helps protect users from malicious websites and potential online threats. Built with React, TypeScript, and Tailwind CSS, Shield Web Guard provides real-time security scanning and threat detection capabilities.

## Features

- **URL Security Scanning**: Deep analysis of web addresses to detect potential threats
- **SSL Certificate Verification**: Validates security certificates and protocols
- **Threat Detection**: Identifies multiple security risks including:
  - Insecure connections (non-HTTPS)
  - Suspicious top-level domains
  - Potential malware indicators
  - Unusual URL patterns
  - Suspicious special characters
- **Detailed Reports**: Comprehensive security analysis with visual indicators
- **Scan History**: Track and review previous security scans
- **Responsive Design**: Works seamlessly across all devices

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/shield-web-guard.git
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Enter a URL in the input field
2. Click the "Scan URL" button
3. Review the detailed security analysis
4. Check the scan history for previous results

## Security Checks

Shield Web Guard performs the following security checks:

- Protocol verification (HTTPS)
- Domain analysis
- SSL certificate validation
- URL structure analysis
- Special character detection
- Response time monitoring
- TLD (Top Level Domain) verification

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Vite
- Lucide React (for icons)
- date-fns (for date formatting)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with security best practices in mind
- Designed for real-world usage
- Continuously updated security checks