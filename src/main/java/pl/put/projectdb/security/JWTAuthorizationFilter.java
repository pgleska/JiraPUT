package pl.put.projectdb.security;

import static pl.put.projectdb.security.SecurityConstants.*;

import java.io.IOException;
import java.util.ArrayList;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;

import pl.put.projectdb.model.Employee;
import pl.put.projectdb.repository.EmployeeRepository;

public class JWTAuthorizationFilter extends BasicAuthenticationFilter {
	private EmployeeRepository employeeRepository;
	private Employee currentUser;
	
	public JWTAuthorizationFilter(AuthenticationManager authenticationManager, EmployeeRepository employeeRepository) {
		super(authenticationManager);
		this.employeeRepository = employeeRepository;
	}
	
	@Override
    protected void doFilterInternal(HttpServletRequest req,
                                    HttpServletResponse res,
                                    FilterChain chain) throws IOException, ServletException {
        String header = req.getHeader(HEADER_STRING);

        if (header == null || !header.startsWith(TOKEN_PREFIX)) {
            chain.doFilter(req, res);
            return;
        }

        UsernamePasswordAuthenticationToken authentication = getAuthentication(req);

        SecurityContextHolder.getContext().setAuthentication(authentication);
        chain.doFilter(req, res);
    }
	
	private UsernamePasswordAuthenticationToken getAuthentication(HttpServletRequest request) {
        String token = request.getHeader(HEADER_STRING);
        if (token != null) {
        	token = token.replace(TOKEN_PREFIX, "");
        	
            // parse the token.
            String user = JWT.require(Algorithm.HMAC512(SECRET.getBytes()))
                    .build()
                    .verify(token)
                    .getSubject();
                                    
            if (user != null) {
            	currentUser = employeeRepository.findByLogin(user);
            	if(currentUser != null)
            		if(currentUser.getToken() != null)
		            	if(currentUser.getToken().equals(token)) {
		            		return new UsernamePasswordAuthenticationToken(user, null, new ArrayList<>());
		            	}
            }
            return null;
        }
        return null;
    }
}
