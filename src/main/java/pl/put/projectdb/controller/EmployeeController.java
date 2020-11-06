package pl.put.projectdb.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import pl.put.projectdb.model.Employee;
import pl.put.projectdb.repository.EmployeeRepository;

@RestController
@RequestMapping("/api/employee")
public class EmployeeController {

	@Autowired
	private EmployeeRepository employeeRepository;
	
	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;
	
	@PostMapping(value = "/sign-up", consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseStatus(value = HttpStatus.CREATED)
    public Map<String, String> signUp(@RequestBody Employee user) {
		Map<String, String> response = new HashMap<>();
		if(employeeRepository.findByLogin(user.getLogin()) == null) {
			user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
	    	employeeRepository.saveAndFlush(user);
	    	response.put("status", "user.created");
	    	return response;
		} else {
			response.put("status", "user.duplicated");
			return response;
		}
    }
}
