import { DetectionStatus, ScanResult } from '../types';

const SAFE_DOMAINS = [
  'google.com', 'github.com', 'microsoft.com', 'apple.com', 'amazon.com', 'facebook.com', 
  'linkedin.com', 'twitter.com', 'youtube.com', 'openai.com', 'google.co.uk', 'google.ca',
  'instagram.com', 'whatsapp.com', 'telegram.org', 'zoom.us', 'slack.com', 'discord.com',
  'dropbox.com', 'onedrive.com', 'drive.google.com', 'docs.google.com', 'mail.google.com',
  'login.microsoft.com', 'accounts.google.com', 'signin.aws.amazon.com', 'paypal.com',
  'ebay.com', 'netflix.com', 'spotify.com', 'reddit.com', 'stackoverflow.com', 'wikipedia.org',
  'mozilla.org', 'firefox.com', 'chrome.google.com', 'support.google.com', 'help.github.com',
  // Safe shorteners from trusted companies
  'goo.gl', 'maps.app.goo.gl', 'bit.ly', 't.co', 'youtu.be'
];
const SUSPICIOUS_KEYWORDS = ['login', 'verify', 'secure', 'bank', 'account', 'update', 'password', 'bonus', 'claim', 'refund', 'signin', 'auth'];
const SUSPICIOUS_TLDS = ['.xyz', '.top', '.loan', '.work', '.click', '.gq', '.ml', '.cf', '.tk', '.zip', '.mov'];
const SHORTENERS = ['tinyurl.com', 'rebrand.ly', 'is.gd', 'buff.ly'];

export const analyzeUrl = (urlStr: string): ScanResult => {
  let processedUrl = urlStr.trim();
  
  // Basic heuristic: if it looks like a domain without a protocol, add https
  if (!/^https?:\/\//i.test(processedUrl)) {
    processedUrl = 'https://' + processedUrl;
  }

  let url: URL;
  try {
    url = new URL(processedUrl);
  } catch (e) {
    return {
      url: urlStr,
      status: DetectionStatus.PHISHING,
      explanation: 'The link provided is not a valid URL format. This is often a sign of malicious intent or a broken redirect chain.'
    };
  }

  const hostname = url.hostname.toLowerCase();
  
  // 1. Check Safe List FIRST - if it's a known safe domain, return safe regardless of other patterns
  const isSafeDomain = SAFE_DOMAINS.some(d => hostname === d || hostname.endsWith('.' + d));
  if (isSafeDomain) {
    return {
      url: processedUrl,
      status: DetectionStatus.SAFE,
      explanation: 'This domain is a verified well-known platform with high security standards and a long-standing reputation.'
    };
  }

  // 2. Check Shorteners
  if (SHORTENERS.some(s => hostname.includes(s))) {
    return {
      url: processedUrl,
      status: DetectionStatus.SUSPICIOUS,
      explanation: 'This link uses a URL shortener. Shorteners are frequently used to mask malicious destinations. Verify the final destination before entering data.'
    };
  }

  // 3. Check Phishing patterns - only apply these to non-safe domains
  const containsPhishingKeywords = SUSPICIOUS_KEYWORDS.some(k => hostname.includes(k));
  const isSuspiciousTLD = SUSPICIOUS_TLDS.some(t => hostname.endsWith(t));
  const hasIPAddress = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(hostname);

  // Only flag as phishing for IP addresses or suspicious TLDs with phishing keywords
  if (hasIPAddress) {
    return {
      url: processedUrl,
      status: DetectionStatus.PHISHING,
      explanation: 'Critical Threat: This site uses an IP address instead of a domain name, which is often used to hide malicious activities.'
    };
  }

  if (isSuspiciousTLD && containsPhishingKeywords) {
    return {
      url: processedUrl,
      status: DetectionStatus.PHISHING,
      explanation: 'Critical Threat: This site uses a suspicious domain extension combined with phishing keywords.'
    };
  }

  if (isSuspiciousTLD) {
    return {
      url: processedUrl,
      status: DetectionStatus.SUSPICIOUS,
      explanation: 'This domain uses a low-reputation top-level domain that is commonly associated with malicious websites.'
    };
  }

  // Default to Safe for all other cases - most websites are legitimate
  return {
    url: processedUrl,
    status: DetectionStatus.SAFE,
    explanation: 'No immediate threats detected. The domain appears legitimate, but always verify the identity of the requester before providing credentials.'
  };
};
