package pl.jiraput.security;

public abstract class SecurityConstants {
	public static final String SECRET = "SecretKeyToGenJWTs";
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String HEADER_STRING = "Authorization";
    public static final String SIGN_UP_URL = "/api/employee/sign-up";
}
