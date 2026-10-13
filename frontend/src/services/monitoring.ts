import LogRocket from 'logrocket';

interface TrackUser {
  id: string;
  name: string;
  email: string;
  role?: string;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const LOGROCKET_APP_ID = import.meta.env.VITE_LOGROCKET_APP_ID || 'ytlnfv/onlineshoptest';
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
let isLogRocketInitialized = false;
let isGAInitialized = false;

export const initMonitoring = (): void => {
  // 1. Inisialisasi LogRocket
  if (LOGROCKET_APP_ID) {
    try {
      LogRocket.init(LOGROCKET_APP_ID);
      isLogRocketInitialized = true;
      console.log(`[Monitoring] LogRocket aktif dengan App ID: ${LOGROCKET_APP_ID}`);
    } catch (err) {
      console.warn('[Monitoring] Gagal inisialisasi LogRocket:', err);
    }
  } else {
    console.info('[Monitoring] LogRocket belum diaktifkan (atur VITE_LOGROCKET_APP_ID di .env)');
  }

  // 2. Inisialisasi Google Analytics (GA4)
  if (GA_MEASUREMENT_ID && typeof window !== 'undefined') {
    try {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer?.push(arguments);
      };

      window.gtag('js', new Date());
      window.gtag('config', GA_MEASUREMENT_ID);
      isGAInitialized = true;
      console.log(`[Monitoring] Google Analytics aktif dengan ID: ${GA_MEASUREMENT_ID}`);
    } catch (err) {
      console.warn('[Monitoring] Gagal inisialisasi Google Analytics:', err);
    }
  } else {
    console.info('[Monitoring] Google Analytics belum diaktifkan (atur VITE_GA_MEASUREMENT_ID di .env)');
  }
};

export const identifyUser = (user: TrackUser): void => {
  if (isLogRocketInitialized) {
    LogRocket.identify(user.id, {
      name: user.name,
      email: user.email,
      role: user.role || 'user'
    });
  }

  if (isGAInitialized && window.gtag) {
    window.gtag('set', 'user_properties', {
      user_id: user.id,
      user_name: user.name
    });
  }
};

export const trackEvent = (eventName: string, params?: Record<string, unknown>): void => {
  if (isGAInitialized && window.gtag) {
    window.gtag('event', eventName, params);
  }

  console.log(`[Analytics Event]: ${eventName}`, params || {});
};
