package pl.put.projectdb.security;

import static com.auth0.jwt.algorithms.Algorithm.HMAC512;
import static pl.put.projectdb.security.SecurityConstants.HEADER_STRING;
import static pl.put.projectdb.security.SecurityConstants.SECRET;
import static pl.put.projectdb.security.SecurityConstants.TOKEN_PREFIX;

import java.io.IOException;
import java.util.ArrayList;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.auth0.jwt.JWT;
import com.fasterxml.jackson.databind.ObjectMapper;

import pl.put.projectdb.model.Employee;
import pl.put.projectdb.repository.EmployeeRepository;

public class JWTAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
	private AuthenticationManager authenticationManager;
	private Employee creds;
	private EmployeeRepository employeeRepository;
	
	public JWTAuthenticationFilter(AuthenticationManager authenticationManager, EmployeeRepository employeeRepository) {
		this.authenticationManager = authenticationManager;
		this.employeeRepository = employeeRepository;
	}
	
	@Override
    public Authentication attemptAuthentication(HttpServletRequest req,
            									HttpServletResponse res) throws AuthenticationException {
        try {
        	creds = new ObjectMapper()
                    .readValue(req.getInputStream(), Employee.class);

            return authenticationManager.authenticate(
                    (Authentication) new UsernamePasswordAuthenticationToken(
                            creds.getLogin(),
                            creds.getPassword(),
                            new ArrayList<>())
            );
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
	
	@Override
    protected void successfulAuthentication(HttpServletRequest req,
                                            HttpServletResponse res,
                                            FilterChain chain,
                                            Authentication auth) throws IOException, ServletException {
    	
        String token = JWT.create()
                .withSubject(((User)auth.getPrincipal()).getUsername())
                .sign(HMAC512(SECRET.getBytes()));
        res.addHeader(HEADER_STRING, TOKEN_PREFIX + token);
        
        Employee employee = employeeRepository.findByLogin(creds.getLogin());
        employee.setToken(token);
        employeeRepository.saveAndFlush(employee);
        
        String body = "{ \"id\" : " + employee.getId() + ", \"JWT\" : \""+ token + "\"}";
        res.getWriter().write(body);
        res.getWriter().flush();
        res.getWriter().close();
    }
}
