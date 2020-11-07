package pl.put.projectdb.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import pl.put.projectdb.model.Employee;
import pl.put.projectdb.model.Team;
import pl.put.projectdb.repository.EmployeeRepository;
import pl.put.projectdb.repository.TeamRepository;

@RestController
@RequestMapping("/api/employee")
public class EmployeeController {

	@Autowired
	private EmployeeRepository employeeRepository;
	
	@Autowired
	private TeamRepository teamReposiotry;
	
	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;
	
	@PostMapping(value = "/sign-up", consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseStatus(value = HttpStatus.CREATED)
    public Map<String, String> signUp(@RequestBody Employee user) {
		Map<String, String> response = new HashMap<>();
		if(employeeRepository.findByLogin(user.getLogin()) == null) {
			user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
	    	employeeRepository.save(user);
	    	response.put("status", "user.created");
	    	return response;
		} else {
			response.put("status", "user.duplicated");
			return response;
		}
	}
	
	@GetMapping(value = "/{login}", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseStatus(value = HttpStatus.OK)
	public @ResponseBody Map<String, String> returnEmployeeInfo(@PathVariable String login) {
		Map<String, String> response = new HashMap<>();		
		Employee emp = employeeRepository.findByLogin(login);
		response.put("id", emp.getId().toString());
		response.put("login", emp.getLogin());
		response.put("firstName", emp.getFirstName());
		response.put("lastName", emp.getLastName());
		response.put("team", emp.getTeam().getName());
		return response;
	}
	
	@PatchMapping(value = "/{login}/change_team", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseStatus(value = HttpStatus.OK)
	public @ResponseBody Map<String, String> changeTeam(@PathVariable String login, @RequestBody Map<String, String> data) {
		Map<String, String> response = new HashMap<>();
		Employee emp = employeeRepository.findByLogin(login);
		Team newTeam = teamReposiotry.findByName(data.get("name"));
		if(!newTeam.equals(emp.getTeam())) {
			emp.setTeam(newTeam);
			employeeRepository.save(emp);
			response.put("status", "team.changed");
			return response;
		}
		response.put("status", "team.not.changed");
		return response;
	}
}
