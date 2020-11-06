package pl.put.projectdb.service;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import pl.put.projectdb.model.Employee;
import pl.put.projectdb.repository.EmployeeRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

	@Autowired
	private EmployeeRepository employeeRepository;
	
	@Override
	public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
		Employee employee = employeeRepository.findByLogin(login);
		if(employee == null) {
			throw new UsernameNotFoundException(login);
		}
		return new User(employee.getLogin(), employee.getPassword(), new ArrayList<>());
	}

}
