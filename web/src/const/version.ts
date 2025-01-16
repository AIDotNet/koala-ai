import pkg from '@/../package.json';

import { BRANDING_NAME, ORG_NAME } from './branding';

export const CURRENT_VERSION = pkg.version;

export const isServerMode = false;
export const isUsePgliteDB = false;

export const isDeprecatedEdition = !isServerMode && !isUsePgliteDB;

// @ts-ignore
export const isCustomBranding = BRANDING_NAME !== 'FastChat';
// @ts-ignore
export const isCustomORG = ORG_NAME !== 'FastChat';
