package pl.jiraput.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import pl.jiraput.model.Employee;
import pl.jiraput.model.Technology;
import pl.jiraput.repository.EmployeeRepository;
import pl.jiraput.repository.TechnologyRepository;

@RestController
@RequestMapping("/api/technology")
public class TechnologyController {

	private final TechnologyRepository technologyRepository;
	private final EmployeeRepository employeeRepository;
	
	public TechnologyController(TechnologyRepository technologyRepository, EmployeeRepository employeeRepository) {
		this.technologyRepository = technologyRepository;
		this.employeeRepository = employeeRepository;
	}
	
	@PostMapping(value = "/create", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody ResponseEntity<Map<String, String>> createTechnology(@RequestBody Technology technology) {
		Map<String, String> body = new HashMap<>();
		if(technologyRepository.findByName(technology.getName()) == null) {
	    	technologyRepository.save(technology);
	    	body.put("status", "technology.created");
	    	return new ResponseEntity<>(body, HttpStatus.OK);
		} else {
			body.put("error", "technology.duplicated");
			return new ResponseEntity<>(body, HttpStatus.CONFLICT);
		}
	}
	
	@GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseStatus(value = HttpStatus.OK)
	public @ResponseBody List<Technology> getAllTechnologies() {
		List<Technology> technologies = technologyRepository.findAll();
		return technologies;
	}
	
	@DeleteMapping(value = "/{name}", produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody ResponseEntity<Map<String, String>> deleteTechnology(@PathVariable String name) {
		Map<String, String> body = new HashMap<>();
		Technology technology = technologyRepository.findByName(name);
		if(technology == null) {
			body.put("error", "technology.not.found");
			return new ResponseEntity<Map<String,String>>(body, HttpStatus.NOT_FOUND);
		}
		boolean used = false;
		List<Employee> employees = employeeRepository.findAll();
		empLoop: for(Employee emp : employees) {
			Set<Technology> techs = emp.getTechnologies();
			for(Technology t : techs) {
				if(t.getName().equals(name)) {
					used = true;
					break empLoop;
				}					
			}
		}
		
		if(used) {
			body.put("error", "technology.not.empty");
			return new ResponseEntity<Map<String,String>>(body, HttpStatus.CONFLICT);
		} else {
			technologyRepository.delete(technology);
			body.put("status", "technology.deleted");
			return new ResponseEntity<Map<String,String>>(body, HttpStatus.OK);
		}
	}	
}
