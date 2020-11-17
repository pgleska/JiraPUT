package pl.jiraput.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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
    public @ResponseBody ResponseEntity<Map<String, String>> signUp(@RequestBody Employee user) {
		Map<String, String> body = new HashMap<>();
		if(employeeRepository.findByLogin(user.getLogin()) == null) {
			user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
			Position position = positionRepository.findByName("None");
			user.setPosition(position);
			user.setSalary(position.getMinimumSalary());
	    	employeeRepository.save(user);
	    	body.put("status", "user.created");
	    	return new ResponseEntity<>(body, HttpStatus.CREATED);
		} else {
			body.put("error", "user.duplicated");
			return new ResponseEntity<>(body, HttpStatus.CONFLICT);
		}
	}
	
	@GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseStatus(value = HttpStatus.OK)
	public @ResponseBody List<Map<String, Object>> getAllEmployees() {
		List<Map<String, Object>> result = new ArrayList<>();
		employeeRepository.findAll().forEach(emp -> {
			Map<String, Object> map = new HashMap<>();
			map.put("login", emp.getLogin());
			map.put("firstName", emp.getFirstName());
			map.put("lastName", emp.getLastName());
			map.put("team", (emp.getTeam() != null) ? emp.getTeam().getName() : "");
			map.put("position", emp.getPosition().getName());
			map.put("salary", Float.valueOf(emp.getSalary()));
			result.add(map);
		});
		return result;
	}
	
	@GetMapping(value = "/{login}", produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody ResponseEntity<Map<String, Object>> getEmployeeInfo(@PathVariable String login) {
		Map<String, Object> body = new HashMap<>();		
		Employee emp = employeeRepository.findByLogin(login);
		if(emp == null) {
			body.put("error", "user.not.found");
			return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
		} else {
			body.put("login", emp.getLogin());
			body.put("firstName", emp.getFirstName());
			body.put("lastName", emp.getLastName());
			body.put("team", (emp.getTeam() != null) ? emp.getTeam().getName() : "");
			body.put("position", emp.getPosition().getName());
			body.put("salary", Float.valueOf(emp.getSalary()));
			return new ResponseEntity<>(body, HttpStatus.OK);
		}
	}
	
	@PatchMapping(value = "/{login}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody ResponseEntity<Map<String, String>> changeTeam(@PathVariable String login, @RequestBody Map<String, Object> data) {
		Map<String, String> body = new HashMap<>();
		Employee emp = employeeRepository.findByLogin(login);
		if(emp == null) {
			body.put("error", "user.not.found");
		}
		Team newTeam = teamReposiotry.findByName(String.valueOf(data.get("team")));
		if(newTeam == null) {
			body.put("error", "team.not.found");
		}
		Position newPosition = positionRepository.findByName(String.valueOf(data.get("position")));
		if(newPosition == null) {
			body.put("error", "position.not.found");
		}		
		if(body.containsKey("error")) {
			return new ResponseEntity<Map<String,String>>(body, HttpStatus.NOT_FOUND);
		} else {		
			emp.setFirstName(String.valueOf(data.get("firstName")));
			emp.setLastName(String.valueOf(data.get("lastName")));
			emp.setSalary(Float.valueOf(String.valueOf(data.get("salary"))));		
			emp.setTeam(newTeam);
			emp.setPosition(newPosition);
			System.out.println(newPosition.getName());
			employeeRepository.save(emp);
			body.put("status", "user.updated");
			return new ResponseEntity<Map<String,String>>(body, HttpStatus.OK);
		}
	}
}
