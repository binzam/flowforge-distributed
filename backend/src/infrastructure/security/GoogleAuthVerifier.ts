export interface GoogleUserPayload {
  googleId: string;
  email: string;
  name: string;
  emailVerified: boolean;
}

export interface GoogleAuthVerifier {
  verify(idToken: string): Promise<GoogleUserPayload>;
}
