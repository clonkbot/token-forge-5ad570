import { useState, useEffect } from 'react';
import './styles.css';

interface TokenConfig {
  name: string;
  symbol: string;
  totalSupply: string;
  decimals: string;
}

const FEE_ADDRESS = '0x928a8918D31941FB6b7b1F5456964A8bcbCB2435';

function GlitchText({ text, className = '' }: { text: string; className?: string }) {
  return (
    <span className={`glitch ${className}`} data-text={text}>
      {text}
    </span>
  );
}

function MatrixRain() {
  useEffect(() => {
    const canvas = document.getElementById('matrix') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$ETH@#%&';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    function draw() {
      if (!ctx) return;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ff4120';
      ctx.font = `${fontSize}px "JetBrains Mono"`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    const interval = setInterval(draw, 50);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas id="matrix" className="matrix-canvas" />;
}

function TerminalLine({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`terminal-line ${visible ? 'visible' : ''}`} style={{ animationDelay: `${delay}ms` }}>
      <span className="terminal-prompt">{'>'}</span>
      {children}
    </div>
  );
}

export default function App() {
  const [config, setConfig] = useState<TokenConfig>({
    name: '',
    symbol: '',
    totalSupply: '1000000',
    decimals: '18',
  });
  const [step, setStep] = useState(1);
  const [deploying, setDeploying] = useState(false);
  const [deployed, setDeployed] = useState(false);
  const [txHash, setTxHash] = useState('');

  const handleDeploy = async () => {
    if (!config.name || !config.symbol) return;

    setDeploying(true);

    // Simulate deployment
    await new Promise(resolve => setTimeout(resolve, 3000));

    const fakeHash = '0x' + Array(64).fill(0).map(() =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');

    setTxHash(fakeHash);
    setDeploying(false);
    setDeployed(true);
  };

  return (
    <div className="app-container">
      <MatrixRain />

      <div className="scanlines" />
      <div className="noise" />

      <header className="header">
        <div className="logo-container">
          <div className="logo-hex">
            <svg viewBox="0 0 100 100" className="hex-svg">
              <polygon
                points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <text x="50" y="58" textAnchor="middle" className="hex-text">TX</text>
            </svg>
          </div>
          <h1 className="logo-text">
            <GlitchText text="TOKEN_FORGE" />
          </h1>
        </div>
        <div className="status-bar">
          <span className="status-item">
            <span className="pulse-dot" />
            NETWORK: MAINNET
          </span>
          <span className="status-item">BLOCK: {Math.floor(Date.now() / 1000)}</span>
        </div>
      </header>

      <main className="main-content">
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="terminal-dots">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
            </div>
            <span className="terminal-title">deploy_token.exe</span>
          </div>

          <div className="terminal-body">
            <TerminalLine delay={100}>
              <span className="text-accent">INITIALIZING</span> token deployment protocol...
            </TerminalLine>
            <TerminalLine delay={300}>
              <span className="text-muted">Fee recipient:</span> <span className="text-warning">{FEE_ADDRESS}</span>
            </TerminalLine>
            <TerminalLine delay={500}>
              <span className="text-success">READY</span> for token configuration
            </TerminalLine>

            <div className="config-section">
              <div className="step-indicator">
                <div className={`step ${step >= 1 ? 'active' : ''}`}>01</div>
                <div className="step-line" />
                <div className={`step ${step >= 2 ? 'active' : ''}`}>02</div>
                <div className="step-line" />
                <div className={`step ${step >= 3 ? 'active' : ''}`}>03</div>
              </div>

              {step === 1 && (
                <div className="form-section fade-in">
                  <h3 className="section-title">
                    <span className="bracket">[</span> TOKEN IDENTITY <span className="bracket">]</span>
                  </h3>

                  <div className="input-group">
                    <label className="input-label">TOKEN_NAME</label>
                    <input
                      type="text"
                      className="cyber-input"
                      placeholder="Enter token name..."
                      value={config.name}
                      onChange={(e) => setConfig({ ...config, name: e.target.value })}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">SYMBOL</label>
                    <input
                      type="text"
                      className="cyber-input"
                      placeholder="e.g. ETH, BTC..."
                      value={config.symbol}
                      onChange={(e) => setConfig({ ...config, symbol: e.target.value.toUpperCase() })}
                      maxLength={10}
                    />
                  </div>

                  <button
                    className="cyber-btn"
                    onClick={() => setStep(2)}
                    disabled={!config.name || !config.symbol}
                  >
                    <span className="btn-text">CONTINUE</span>
                    <span className="btn-glitch" />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="form-section fade-in">
                  <h3 className="section-title">
                    <span className="bracket">[</span> TOKENOMICS <span className="bracket">]</span>
                  </h3>

                  <div className="input-group">
                    <label className="input-label">TOTAL_SUPPLY</label>
                    <input
                      type="number"
                      className="cyber-input"
                      placeholder="1000000"
                      value={config.totalSupply}
                      onChange={(e) => setConfig({ ...config, totalSupply: e.target.value })}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">DECIMALS</label>
                    <input
                      type="number"
                      className="cyber-input"
                      placeholder="18"
                      value={config.decimals}
                      onChange={(e) => setConfig({ ...config, decimals: e.target.value })}
                      min={0}
                      max={18}
                    />
                  </div>

                  <div className="btn-group">
                    <button className="cyber-btn secondary" onClick={() => setStep(1)}>
                      <span className="btn-text">BACK</span>
                    </button>
                    <button
                      className="cyber-btn"
                      onClick={() => setStep(3)}
                    >
                      <span className="btn-text">CONTINUE</span>
                      <span className="btn-glitch" />
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && !deployed && (
                <div className="form-section fade-in">
                  <h3 className="section-title">
                    <span className="bracket">[</span> DEPLOY CONFIRMATION <span className="bracket">]</span>
                  </h3>

                  <div className="config-summary">
                    <div className="summary-row">
                      <span className="summary-label">NAME</span>
                      <span className="summary-value">{config.name}</span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-label">SYMBOL</span>
                      <span className="summary-value">${config.symbol}</span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-label">SUPPLY</span>
                      <span className="summary-value">{Number(config.totalSupply).toLocaleString()}</span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-label">DECIMALS</span>
                      <span className="summary-value">{config.decimals}</span>
                    </div>
                    <div className="summary-row highlight">
                      <span className="summary-label">FEE_RECIPIENT</span>
                      <span className="summary-value address">{FEE_ADDRESS}</span>
                    </div>
                  </div>

                  <div className="btn-group">
                    <button className="cyber-btn secondary" onClick={() => setStep(2)} disabled={deploying}>
                      <span className="btn-text">BACK</span>
                    </button>
                    <button
                      className="cyber-btn deploy"
                      onClick={handleDeploy}
                      disabled={deploying}
                    >
                      {deploying ? (
                        <span className="btn-text loading">
                          <span className="loading-dots">DEPLOYING</span>
                        </span>
                      ) : (
                        <>
                          <span className="btn-text">DEPLOY TOKEN</span>
                          <span className="btn-glitch" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {deployed && (
                <div className="form-section fade-in success-section">
                  <div className="success-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <h3 className="success-title">
                    <GlitchText text="DEPLOYMENT_SUCCESSFUL" />
                  </h3>
                  <div className="tx-hash">
                    <span className="tx-label">TX_HASH:</span>
                    <code className="tx-value">{txHash}</code>
                  </div>
                  <button
                    className="cyber-btn"
                    onClick={() => {
                      setDeployed(false);
                      setStep(1);
                      setConfig({ name: '', symbol: '', totalSupply: '1000000', decimals: '18' });
                    }}
                  >
                    <span className="btn-text">DEPLOY ANOTHER</span>
                    <span className="btn-glitch" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className="info-panel">
          <div className="info-card">
            <h4 className="info-title">// HOW_IT_WORKS</h4>
            <ul className="info-list">
              <li><span className="list-marker">01</span> Configure token identity</li>
              <li><span className="list-marker">02</span> Set tokenomics parameters</li>
              <li><span className="list-marker">03</span> Review and deploy</li>
            </ul>
          </div>

          <div className="info-card">
            <h4 className="info-title">// FEATURES</h4>
            <div className="feature-tags">
              <span className="tag">ERC-20</span>
              <span className="tag">MINTABLE</span>
              <span className="tag">BURNABLE</span>
              <span className="tag">OWNABLE</span>
            </div>
          </div>

          <div className="info-card warning">
            <h4 className="info-title">// WARNING</h4>
            <p className="info-text">
              All deployment fees are sent to the designated protocol address.
              Verify all parameters before deployment.
            </p>
          </div>
        </aside>
      </main>

      <footer className="footer">
        <span className="footer-text">Requested by @sat_org · Built by @clonkbot</span>
      </footer>
    </div>
  );
}
