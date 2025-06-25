import React, { useState, useCallback, useEffect } from 'react';
import { Copy, RefreshCw, Eye, EyeOff, Check } from 'lucide-react';
import '../styles/index.css'; 
import '../styles/tech.css'; 

const PasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatePassword = useCallback(() => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let charset = '';
    let guaranteedChars = [];

    if (includeUppercase) {
      const chars = excludeSimilar ? uppercase.replace(/[LO]/g, '') : uppercase;
      charset += chars;
      guaranteedChars.push(chars[Math.floor(Math.random() * chars.length)]);
    }

    if (includeLowercase) {
      const chars = excludeSimilar ? lowercase.replace(/[il]/g, '') : lowercase;
      charset += chars;
      guaranteedChars.push(chars[Math.floor(Math.random() * chars.length)]);
    }

    if (includeNumbers) {
      const chars = excludeSimilar ? numbers.replace(/[10]/g, '') : numbers;
      charset += chars;
      guaranteedChars.push(chars[Math.floor(Math.random() * chars.length)]);
    }

    if (includeSymbols) {
      charset += symbols;
      guaranteedChars.push(symbols[Math.floor(Math.random() * symbols.length)]);
    }

    if (!charset) {
      setPassword('');
      return;
    }

    let result = guaranteedChars.join('');
    for (let i = guaranteedChars.length; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    result = result.split('').sort(() => Math.random() - 0.5).join('');
    setPassword(result);
    setCopied(false);
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeSimilar]);

  const copyToClipboard = async () => {
    if (password) {
      try {
        await navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy password');
      }
    }
  };

  const getPasswordStrength = () => {
    if (!password) return { strength: '', color: '', width: '0%' };

    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 2) return { strength: 'Weak', color: 'strength-weak', width: '33%' };
    if (score <= 4) return { strength: 'Medium', color: 'strength-medium', width: '66%' };
    return { strength: 'Strong', color: 'strength-strong', width: '100%' };
  };

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const strengthInfo = getPasswordStrength();

  return (
    <div className="password-generator">
      <div className="title-section">
        <h1 className="title">Password Generator</h1>
        <p className="subtitle">Create secure passwords with custom criteria</p>
      </div>

      <div className="display-section">
        <div className="password-input-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            readOnly
            className="password-input"
            placeholder="Generated password will appear here"
          />
          <div className="input-actions">
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="icon-button"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <button
              onClick={copyToClipboard}
              className="icon-button"
              title="Copy to clipboard"
              disabled={!password}
            >
              {copied ? <Check size={16} className="copied-icon" /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        {password && (
          <div className="strength-wrapper">
            <div className="strength-header">
              <span className="strength-label">Strength:</span>
              <span className={`strength-value ${strengthInfo.color}`}>
                {strengthInfo.strength}
              </span>
            </div>
            <div className="strength-bar-background">
              <div
                className={`strength-bar ${strengthInfo.color}`}
                style={{ width: strengthInfo.width }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <div className="slider-section">
        <div className="slider-header">
          <label className="slider-label">Length</label>
          <span className="slider-value">{length}</span>
        </div>
        <input
          type="range"
          min="4"
          max="128"
          value={length}
          onChange={(e) => setLength(parseInt(e.target.value))}
          className="slider"
        />
      </div>

      <div className="options-section">
        <div className="option-item">
          <label>Uppercase (A-Z)</label>
          <input
            type="checkbox"
            checked={includeUppercase}
            onChange={(e) => setIncludeUppercase(e.target.checked)}
          />
        </div>
        <div className="option-item">
          <label>Lowercase (a-z)</label>
          <input
            type="checkbox"
            checked={includeLowercase}
            onChange={(e) => setIncludeLowercase(e.target.checked)}
          />
        </div>
        <div className="option-item">
          <label>Numbers (0-9)</label>
          <input
            type="checkbox"
            checked={includeNumbers}
            onChange={(e) => setIncludeNumbers(e.target.checked)}
          />
        </div>
        <div className="option-item">
          <label>Symbols (!@#$...)</label>
          <input
            type="checkbox"
            checked={includeSymbols}
            onChange={(e) => setIncludeSymbols(e.target.checked)}
          />
        </div>
        <div className="option-item">
          <label>Exclude similar (il1Lo0O)</label>
          <input
            type="checkbox"
            checked={excludeSimilar}
            onChange={(e) => setExcludeSimilar(e.target.checked)}
          />
        </div>
      </div>

      <button onClick={generatePassword} className="generate-button">
        <RefreshCw size={16} />
        Generate New Password
      </button>

      {copied && (
        <div className="copied-notification">
          <span>Password copied to clipboard!</span>
        </div>
      )}
    </div>
  );
};

export default PasswordGenerator;
