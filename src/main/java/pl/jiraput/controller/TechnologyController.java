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
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import pl.jiraput.model.Employee;
import pl.jiraput.model.Project;
import pl.jiraput.model.Technology;
import pl.jiraput.repository.EmployeeRepository;
import pl.jiraput.repository.ProjectRepository;
import pl.jiraput.repository.TechnologyRepository;

@RestController
@RequestMapping("/api/technology")
public class TechnologyController {

	private final TechnologyRepository technologyRepository;
	private final EmployeeRepository employeeRepository;
	private final ProjectRepository projectRepository;
	
	public TechnologyController(TechnologyRepository technologyRepository, EmployeeRepository employeeRepository, ProjectRepository projectRepository) {
		this.technologyRepository = technologyRepository;
		this.employeeRepository = employeeRepository;
		this.projectRepository = projectRepository;
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
	
	@PatchMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody ResponseEntity<Map<String, String>> updateTechnology(@PathVariable Integer id, @RequestBody Technology tech) {
		Map<String, String> body = new HashMap<>();
		Technology technology = technologyRepository.findById(id).orElse(null); 
		if(technology == null) {
			body.put("error", "technology.not.found");
			return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);	
		}
		if(technologyRepository.findByName(technology.getName()) != null) {
			body.put("error", "technology.duplicated");
			return new ResponseEntity<>(body, HttpStatus.CONFLICT);
		} else {
			technology.setName(tech.getName());
	    	technologyRepository.save(technology);
	    	body.put("status", "technology.updated");
	    	return new ResponseEntity<>(body, HttpStatus.OK);
		}
	}
	
	@DeleteMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody ResponseEntity<Map<String, String>> deleteTechnology(@PathVariable Integer id) {
		Map<String, String> body = new HashMap<>();
		Technology technology = technologyRepository.findById(id).orElse(null);
		if(technology == null) {
			body.put("error", "technology.not.found");
			return new ResponseEntity<Map<String,String>>(body, HttpStatus.NOT_FOUND);
		}
		boolean used = false;
		List<Employee> employees = employeeRepository.findAll();
		empLoop: for(Employee emp : employees) {
			Set<Technology> techs = emp.getTechnologies();
			for(Technology t : techs) {
				if(t.getName().equals(technology.getName())) {
					used = true;
					break empLoop;
				}					
			}
		}
		
		List<Project> projects = projectRepository.findAll();
		projLoop: for(Project p : projects) {
			Set<Technology> techs = p.getTechnologies();
			for(Technology t : techs) {
				if(t.getName().equals(technology.getName())) {
					used = true;
					break projLoop;
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
