import { showLoading, hideLoading } from './utils.js';

const BASE_API_URL = "https://api.mejora.com.co/api/";
const ASSETS_URL = "https://api.mejora.com.co/";
const EXPIRATION_MINUTES = 15; // Tiempo de expiración de la sesión en minutos

// Global Fetch Interceptor
const originalFetch = window.fetch;
window.fetch = async function(...args) {
    let method = 'GET';
    if (args[1]) {
        method = (args[1].method || (args[1].body ? 'POST' : 'GET')).toUpperCase();
    }
    
    const urlStr = typeof args[0] === 'string' ? args[0] : (args[0] && args[0].url ? args[0].url : '');
    let isMutation = ['POST', 'PUT', 'DELETE'].includes(method);
    
    if (!isMutation && urlStr && (urlStr.includes('_method=PUT') || urlStr.includes('_method=DELETE'))) {
        isMutation = true;
    }
    
    if (isMutation) {
        showLoading('Procesando...');
    }
    
    try {
        const response = await originalFetch.apply(this, args);
        if (isMutation) {
            hideLoading();
        }
        return response;
    } catch (e) {
        if (isMutation) {
            hideLoading();
        }
        throw e;
    }
};

export default {
  BASE_API_URL,
  ASSETS_URL,
  EXPIRATION_MINUTES
};
