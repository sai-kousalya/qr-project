
import React from 'react';
import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';
import { DetectionStatus } from './types';

export const STATUS_UI_CONFIG = {
  [DetectionStatus.SAFE]: {
    color: 'text-green-600',
    bg: 'bg-green-100',
    border: 'border-green-500',
    icon: <ShieldCheck className="w-16 h-16 text-green-600" />,
    label: 'VERIFIED SAFE',
    alertMessage: 'This QR code is safe to use.',
    description: 'This URL appears to be from a reputable and well-known source. It is likely safe to visit.'
  },
  [DetectionStatus.PHISHING]: {
    color: 'text-red-600',
    bg: 'bg-red-100',
    border: 'border-red-500',
    icon: <ShieldX className="w-16 h-16 text-red-600" />,
    label: 'NOT SAFE - PHISHING',
    alertMessage: 'WARNING: THIS LINK IS MALICIOUS!',
    description: 'Warning! This URL contains patterns commonly associated with credential harvesting or malicious redirects. Do not enter any sensitive information.'
  },
  [DetectionStatus.SUSPICIOUS]: {
    color: 'text-yellow-600',
    bg: 'bg-yellow-100',
    border: 'border-yellow-500',
    icon: <ShieldAlert className="w-16 h-16 text-yellow-600" />,
    label: 'NOT SAFE - SUSPICIOUS',
    alertMessage: 'CAUTION: POTENTIAL THREAT DETECTED',
    description: 'This URL uses an obfuscated domain or a link shortener. Proceed with extreme caution and verify the source.'
  }
};
