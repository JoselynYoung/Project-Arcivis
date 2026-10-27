import { supabase } from './supabaseClient';

export interface AuthResult {
	error: string | null;
}

export async function signUp(email: string, password: string): Promise<AuthResult> {
	const { error } = await supabase.auth.signUp({ email, password });

	if (error) {
		return { error: friendlyMessage(error.message) };
	}

	return { error: null };
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
	const { error } = await supabase.auth.signInWithPassword({ email, password });

	if (error) {
		return { error: friendlyMessage(error.message) };
	}

	return { error: null };
}

export async function signOut(): Promise<{ error: string | null }> {
	const { error } = await supabase.auth.signOut();
	return { error: error?.message ?? null };
}

export async function getSessionEmail(): Promise<string | null> {
	const {
		data: { session }
	} = await supabase.auth.getSession();
	return session?.user.email ?? null;
}

function friendlyMessage(message: string): string {
	if (/invalid login credentials/i.test(message)) {
		return 'Email atau kata sandi salah.';
	}

	if (/already registered|already exists/i.test(message)) {
		return 'Email ini sudah terdaftar. Silakan masuk.';
	}

	if (/password.*(short|length|characters)/i.test(message)) {
		return 'Kata sandi terlalu pendek (minimal 6 karakter).';
	}

	if (/invalid email/i.test(message)) {
		return 'Format email tidak valid.';
	}

	return message;
}
