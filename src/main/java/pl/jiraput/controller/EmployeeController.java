package pl.jiraput.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import pl.jiraput.model.Employee;
import pl.jiraput.model.Position;
import pl.jiraput.model.Team;
import pl.jiraput.model.Technology;
import pl.jiraput.repository.EmployeeRepository;
import pl.jiraput.repository.PositionRepository;
import pl.jiraput.repository.TeamRepository;
import pl.jiraput.repository.TechnologyRepository;

@RestController
@RequestMapping("/api/employee")
public class EmployeeController {
	
	private final EmployeeRepository employeeRepository;	
	private final PositionRepository positionRepository;
	private final TeamRepository teamReposiotry;
	private final TechnologyRepository technologyRepository;
	private final BCryptPasswordEncoder bCryptPasswordEncoder;
	
	public EmployeeController(EmployeeRepository employeeRepository, PositionRepository positionRepository,
								TeamRepository teamRepository, TechnologyRepository technologyRepository, 
								BCryptPasswordEncoder bCryptPasswordEncoder) {
		this.employeeRepository = employeeRepository;
		this.positionRepository = positionRepository;
		this.teamReposiotry = teamRepository;
		this.technologyRepository = technologyRepository;
		this.bCryptPasswordEncoder = bCryptPasswordEncoder;
	}
	
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
			map.put("technologies", emp.getTechnologies());
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
			body.put("technologies", emp.getTechnologies());
			return new ResponseEntity<>(body, HttpStatus.OK);
		}
	}
	
	@PatchMapping(value = "/{login}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody ResponseEntity<Map<String, String>> editEmployee(@PathVariable String login, @RequestBody Map<String, Object> data) {
		Map<String, String> body = new HashMap<>();
		Employee emp = employeeRepository.findByLogin(login);
		if(emp == null) {
			body.put("error", "user.not.found");
		}
		String teamName = String.valueOf(data.get("team"));
		if (!teamName.equals("")) {
			Team newTeam = teamReposiotry.findByName(teamName);
			if(newTeam == null) {
				body.put("error", "team.not.found");
			} else {
				emp.setTeam(newTeam);
			}
		} else {
			emp.setTeam(null);
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
			emp.setPosition(newPosition);
			employeeRepository.save(emp);
			body.put("status", "user.edited");
			return new ResponseEntity<Map<String,String>>(body, HttpStatus.OK);
		}
	}
	
	@DeleteMapping(value = "/{login}", produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody ResponseEntity<Map<String, String>> deleteEmployee(@PathVariable String login) {
		Map<String, String> body = new HashMap<>();
		Employee emp = employeeRepository.findByLogin(login);
		if(emp == null) {
			body.put("error", "employee.not.found");
			return new ResponseEntity<Map<String,String>>(body, HttpStatus.NOT_FOUND);
		} if(!emp.getTasks().isEmpty()) {
			body.put("error", "employee.has.tasks");
			return new ResponseEntity<Map<String,String>>(body, HttpStatus.CONFLICT);
		} else {
			employeeRepository.delete(emp);
			body.put("status", "employee.deleted");
			return new ResponseEntity<Map<String,String>>(body, HttpStatus.OK);
		}
	}
	
	@PutMapping(value = "/{login}/technology")
	public @ResponseBody ResponseEntity<Map<String, String>> addTechnology(@PathVariable String login, @RequestBody Technology data) {
		Map<String, String> body = new HashMap<>();
		Technology technology = technologyRepository.findByName(data.getName());
		Employee emp = employeeRepository.findByLogin(login);
		
		if(emp == null) {
			body.put("error", "employee.not.found");
			return new ResponseEntity<Map<String,String>>(body, HttpStatus.NOT_FOUND);
		} else if (technology == null) {
			body.put("error", "technology.not.found");
			return new ResponseEntity<Map<String,String>>(body, HttpStatus.NOT_FOUND);
		}
		Set<Technology> technologies = emp.getTechnologies();
		if(technologies == null) 
			technologies = new HashSet<>();
		Set<Employee> employees = technology.getEmployees();
		if(employees == null) 
			employees = new HashSet<>();
		
		if(technologies.add(technology)) {
			emp.setTechnologies(technologies);
			employees.add(emp);
			technology.setEmployees(employees);
			employeeRepository.save(emp);
			technologyRepository.save(technology);
			body.put("status", "technology.added");			
		} else {
			body.put("status", "technology.already.assigned");
		}			
		return new ResponseEntity<Map<String,String>>(body, HttpStatus.OK);
	}
	
	@DeleteMapping(value = "/{login}/technology/{id}")
	public @ResponseBody ResponseEntity<Map<String, String>> removeTechnology(@PathVariable String login, @PathVariable Integer id) {
		Map<String, String> body = new HashMap<>();
		Technology technology = technologyRepository.findById(id).orElse(null);
		Employee emp = employeeRepository.findByLogin(login);
		
		if(emp == null) {
			body.put("error", "employee.not.found");
			return new ResponseEntity<Map<String,String>>(body, HttpStatus.NOT_FOUND);
		} else if (technology == null) {
			body.put("error", "technology.not.found");
			return new ResponseEntity<Map<String,String>>(body, HttpStatus.NOT_FOUND);
		}
		Set<Technology> technologies = emp.getTechnologies();
		if(technologies == null) 
			technologies = new HashSet<>();
		Set<Employee> employees = technology.getEmployees();
		if(employees == null) 
			employees = new HashSet<>();
		
		if(technologies.remove(technology)) {
			emp.setTechnologies(technologies);
			employees.add(emp);
			technology.setEmployees(employees);
			employeeRepository.save(emp);
			technologyRepository.save(technology);
			body.put("status", "technology.removed");			
		} else {
			body.put("status", "technology.unknown");
		}			
		return new ResponseEntity<Map<String,String>>(body, HttpStatus.OK);
	}
}
