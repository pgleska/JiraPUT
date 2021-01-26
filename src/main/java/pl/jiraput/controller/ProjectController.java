package pl.jiraput.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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

import pl.jiraput.model.Contract;
import pl.jiraput.model.Employee;
import pl.jiraput.model.Project;
import pl.jiraput.model.Technology;
import pl.jiraput.repository.ProjectRepository;
import pl.jiraput.repository.TechnologyRepository;

@RestController
@RequestMapping("/api/project")
public class ProjectController {

	private final ProjectRepository projectRepository;
	private final TechnologyRepository technologyRepository;
	
	public ProjectController(ProjectRepository projectRepository, TechnologyRepository technologyRepository) {
		this.projectRepository = projectRepository;
		this.technologyRepository = technologyRepository;
	}
	
	@PostMapping(value = "/create", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody ResponseEntity<Map<String, String>> createProject(@RequestBody Project project) {
		Map<String, String> body = new HashMap<>();
		if(projectRepository.findByName(project.getName()) != null) {
			body.put("error", "project.duplicated");
			return new ResponseEntity<>(body, HttpStatus.CONFLICT);
		} 
		projectRepository.save(project);
		body.put("status", "project.created");
		return new ResponseEntity<>(body, HttpStatus.CREATED);
	}
	
	@GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseStatus(code = HttpStatus.OK)
	public @ResponseBody List<Map<String, Object>> getAllProjects() {
		return projectRepository.findAll().parallelStream().map(p -> {
			Map<String, Object> res = new HashMap<>();
			res.put("id", p.getId());
			res.put("name", p.getName().toString());
			res.put("version", p.getVersion());
			res.put("description", p.getDescription());
			res.put("contracts", p.getContracts().stream().map(Contract::getContractNumber).collect(Collectors.toList()));
			res.put("technologies", getTechnologies(p));
			return res;
		}).collect(Collectors.toList());
	}
	
	private List<Map<String, Object>> getTechnologies(Project p) {
		List<Map<String, Object>> technologies = new ArrayList<>();
		Set<Technology> temp = p.getTechnologies();
		if (!temp.isEmpty()) {
			temp.stream().forEach(t -> {
				Map<String, Object> technology = new HashMap<>();
				technology.put("id", t.getId());
				technology.put("name", t.getName());
				technologies.add(technology);
			});
		}
		return technologies;
	}
	
	@PatchMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody ResponseEntity<Map<String, String>> editProject(@PathVariable Integer id, @RequestBody Map<String, String> data) {
		Map<String, String> body = new HashMap<>();
		Project project = projectRepository.findById(id).orElse(null);
		if(project == null) {
			body.put("error", "project.not.found");
			return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
		}
		if(data.containsKey("name")) {
			String projectName = data.get("name");
			if(projectRepository.findByName(projectName) != null) {
				body.put("error", "project.duplicated");
				return new ResponseEntity<>(body, HttpStatus.CONFLICT);
			}
			project.setName(data.get("name"));
		}						
		if(data.containsKey("version")) 
			project.setVersion(data.get("version"));
		if(data.containsKey("description")) 
			project.setDescription(data.get("description"));
		projectRepository.save(project);
		body.put("status", "project.updated");
		return new ResponseEntity<Map<String,String>>(body, HttpStatus.OK);
	}
	
	@DeleteMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody ResponseEntity<Map<String, String>> deleteProject(@PathVariable Integer id) {
		Map<String, String> body = new HashMap<>();
		Project project = projectRepository.findById(id).orElse(null);
		if(project == null) {
			body.put("error", "project.not.found");
			return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
		}
		if(!project.getContracts().isEmpty()) {
			body.put("error", "project.not.empty");
			return new ResponseEntity<>(body, HttpStatus.CONFLICT);
		} else if(!project.getEpics().isEmpty()) {
			body.put("error", "project.has.epics");
			return new ResponseEntity<>(body, HttpStatus.CONFLICT);
		} else {
			projectRepository.delete(project);
			body.put("status", "position.deleted");
			return new ResponseEntity<Map<String,String>>(body, HttpStatus.OK);
		}
	}
	
	@PutMapping(value = "/{id}/technology")
	public @ResponseBody ResponseEntity<Map<String, String>> addTechnology(@PathVariable Integer id, @RequestBody Technology data) {
		Map<String, String> body = new HashMap<>();
		Technology technology = technologyRepository.findByName(data.getName());
		Project project = projectRepository.findById(id).orElse(null);
		
		if(project == null) {
			body.put("error", "project.not.found");
			return new ResponseEntity<Map<String,String>>(body, HttpStatus.NOT_FOUND);
		} else if (technology == null) {
			body.put("error", "technology.not.found");
			return new ResponseEntity<Map<String,String>>(body, HttpStatus.NOT_FOUND);
		}
		Set<Technology> technologies = project.getTechnologies();
		if(technologies == null) 
			technologies = new HashSet<>();
		Set<Project> projects = technology.getProjects();
		if(projects == null) 
			projects = new HashSet<>();
		
		if(technologies.add(technology)) {
			project.setTechnologies(technologies);
			projects.add(project);
			technology.setProjects(projects);
			projectRepository.save(project);
			technologyRepository.save(technology);
			body.put("status", "technology.added");			
		} else {
			body.put("status", "technology.already.assigned");
		}			
		return new ResponseEntity<Map<String,String>>(body, HttpStatus.OK);
	}
	
	@DeleteMapping(value = "/{id}/technology/{tech}")
	public @ResponseBody ResponseEntity<Map<String, String>> removeTechnology(@PathVariable Integer id, @PathVariable Integer tech) {
		Map<String, String> body = new HashMap<>();
		Technology technology = technologyRepository.findById(tech).orElse(null);
		Project project = projectRepository.findById(id).orElse(null);
		
		if(project == null) {
			body.put("error", "project.not.found");
			return new ResponseEntity<Map<String,String>>(body, HttpStatus.NOT_FOUND);
		} else if (technology == null) {
			body.put("error", "technology.not.found");
			return new ResponseEntity<Map<String,String>>(body, HttpStatus.NOT_FOUND);
		}
		Set<Technology> technologies = project.getTechnologies();
		if(technologies == null) 
			technologies = new HashSet<>();
		Set<Project> projects = technology.getProjects();
		if(projects == null) 
			projects = new HashSet<>();
		
		if(technologies.remove(technology)) {
			project.setTechnologies(technologies);
			projects.add(project);
			technology.setProjects(projects);
			projectRepository.save(project);
			technologyRepository.save(technology);
			body.put("status", "technology.added");		
		} else {
			body.put("status", "technology.unknown");
		}			
		return new ResponseEntity<Map<String,String>>(body, HttpStatus.OK);
	}
}
