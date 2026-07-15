(function () {
    const API_BASE = '/.netlify/functions/shared-data';
    const storage = window.localStorage;
    const originalGetItem = storage.getItem.bind(storage);
    const originalSetItem = storage.setItem.bind(storage);
    const originalRemoveItem = storage.removeItem.bind(storage);
    const syncableKeys = new Set(['cart', 'currentUser', 'users', 'orders', 'products', 'feedbacks', 'theme', 'catalog_version', 'token', 'admins', 'currentAdmin', 'cravebite_orders', 'cravebite_admin']);

    function isSyncableKey(key) {
        return typeof key === 'string' && key.length > 0 && !key.startsWith('__');
    }

    function tryParseJSON(value) {
        if (typeof value !== 'string') return value;
        try {
            return JSON.parse(value);
        } catch (error) {
            return value;
        }
    }

    function syncFromServerSync(key) {
        if (!isSyncableKey(key)) return;
        try {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', `${API_BASE}/${encodeURIComponent(key)}`, false);
            xhr.send(null);
            if (xhr.status !== 200) return;
            const payload = JSON.parse(xhr.responseText || '{}');
            const serverValue = payload && Object.prototype.hasOwnProperty.call(payload, 'value') ? payload.value : null;
            if (serverValue !== null && serverValue !== undefined) {
                originalSetItem(key, typeof serverValue === 'string' ? serverValue : JSON.stringify(serverValue));
            }
        } catch (error) {
            console.warn('Shared storage sync failed:', error);
        }
    }

    async function syncFromServer(key) {
        if (!isSyncableKey(key)) return;
        try {
            const response = await fetch(`${API_BASE}/${encodeURIComponent(key)}`);
            if (!response.ok) return;
            const payload = await response.json();
            const serverValue = payload && Object.prototype.hasOwnProperty.call(payload, 'value') ? payload.value : null;
            if (serverValue !== null && serverValue !== undefined) {
                originalSetItem(key, typeof serverValue === 'string' ? serverValue : JSON.stringify(serverValue));
            }
        } catch (error) {
            console.warn('Shared storage sync failed:', error);
        }
    }

    async function syncToServer(key, value) {
        if (!isSyncableKey(key)) return;
        try {
            await fetch(`${API_BASE}/${encodeURIComponent(key)}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ value })
            });
        } catch (error) {
            console.warn('Shared storage update failed:', error);
        }
    }

    async function syncRemoveFromServer(key) {
        if (!isSyncableKey(key)) return;
        try {
            await fetch(`${API_BASE}/${encodeURIComponent(key)}`, { method: 'DELETE' });
        } catch (error) {
            console.warn('Shared storage removal failed:', error);
        }
    }

    storage.getItem = function (key) {
        return originalGetItem(key);
    };

    storage.setItem = function (key, value) {
        originalSetItem(key, value);
        if (isSyncableKey(key)) {
            void syncToServer(key, tryParseJSON(value));
        }
    };

    storage.removeItem = function (key) {
        originalRemoveItem(key);
        if (isSyncableKey(key)) {
            void syncRemoveFromServer(key);
        }
    };

    async function bootstrapSharedStorage() {
        for (const key of syncableKeys) {
            syncFromServerSync(key);
            await syncFromServer(key);
        }
    }

    window.getSharedValue = async function (key, fallback = null) {
        const localValue = originalGetItem(key);
        if (localValue !== null) {
            return tryParseJSON(localValue);
        }
        try {
            await syncFromServer(key);
            const syncedValue = originalGetItem(key);
            return syncedValue === null ? fallback : tryParseJSON(syncedValue);
        } catch (error) {
            return fallback;
        }
    };

    window.setSharedValue = async function (key, value) {
        originalSetItem(key, typeof value === 'string' ? value : JSON.stringify(value));
        await syncToServer(key, value);
        return value;
    };

    window.removeSharedValue = async function (key) {
        originalRemoveItem(key);
        await syncRemoveFromServer(key);
    };

    window.__sharedStorageBootstrap = bootstrapSharedStorage();
})();
