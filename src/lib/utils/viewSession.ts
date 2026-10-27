// Stable anonymous view-session id with fallbacks for insecure contexts
// (crypto.randomUUID) and locked storage (private mode).
export function getViewSessionId(): string {
	const key = 'arcivis:view-session';

	try {
		const existing = sessionStorage.getItem(key);
		if (existing) return existing;

		const id = crypto.randomUUID().replaceAll('-', '');
		sessionStorage.setItem(key, id);
		return id;
	} catch {
		const fallback = `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
		try {
			sessionStorage.setItem(key, fallback);
		} catch {
			// Storage unavailable; the caller still gets a usable id.
		}
		return fallback;
	}
}
