package pl.jiraput.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
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

import pl.jiraput.model.Employee;
import pl.jiraput.model.Position;
import pl.jiraput.model.Team;
import pl.jiraput.repository.EmployeeRepository;
import pl.jiraput.repository.PositionRepository;
import pl.jiraput.repository.TeamRepository;

@RestController
@RequestMapping("/api/employee")
public class EmployeeController {

	@Autowired
	private EmployeeRepository employeeRepository;
	
	@Autowired
	private PositionRepository positionRepository;
	
	@Autowired
	private TeamRepository teamReposiotry;
	
	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;
	
	@PostMapping(value = "/sign-up", consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseStatus(value = HttpStatus.CREATED)
    public @ResponseBody Map<String, String> signUp(@RequestBody Employee user) {
		Map<String, String> response = new HashMap<>();
		if(employeeRepository.findByLogin(user.getLogin()) == null) {
			user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
			Position position = positionRepository.findByName("None");
			user.setPosition(position);
			user.setSalary(position.getMinimumSalary());
	    	employeeRepository.save(user);
	    	response.put("status", "user.created");
	    	return response;
		} else {
			response.put("status", "user.duplicated");
			return response;
		}
	}
	
	@GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseStatus(value = HttpStatus.OK)
	public @ResponseBody List<Map<String, String>> getAllEmployees() {
		List<Map<String, String>> result = new ArrayList<>();
		employeeRepository.findAll().forEach(emp -> {
			Map<String, String> map = new HashMap<>();
			map.put("login", emp.getLogin());
			map.put("firstName", emp.getFirstName());
			map.put("lastName", emp.getLastName());
			map.put("team", (emp.getTeam() != null) ? emp.getTeam().getName() : "");
			map.put("position", emp.getPosition().getName());
			map.put("salary", String.valueOf(emp.getSalary()));
			result.add(map);
		});
		return result;
	}
	
	@GetMapping(value = "/{login}", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseStatus(value = HttpStatus.OK)
	public @ResponseBody Map<String, String> getEmployeeInfo(@PathVariable String login) {
		Map<String, String> response = new HashMap<>();		
		Employee emp = employeeRepository.findByLogin(login);
		response.put("login", emp.getLogin());
		response.put("firstName", emp.getFirstName());
		response.put("lastName", emp.getLastName());
		response.put("team", (emp.getTeam() != null) ? emp.getTeam().getName() : "");
		response.put("position", emp.getPosition().getName());
		response.put("salary", String.valueOf(emp.getSalary()));
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
