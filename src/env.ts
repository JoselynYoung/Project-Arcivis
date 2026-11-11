import { defineEnvVars } from '@sveltejs/kit/env';

// Kit 3 no longer reads PUBLIC_* from .env files automatically.
// Declared here, values still come from .env.local at build/dev time.
export const variables = defineEnvVars({
	PUBLIC_SUPABASE_URL: { public: true, static: true },
	PUBLIC_SUPABASE_PUBLISHABLE_KEY: { public: true, static: true }
});
