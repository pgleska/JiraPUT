package pl.jiraput.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

import pl.jiraput.model.Contract;
import pl.jiraput.model.Project;
import pl.jiraput.repository.ProjectRepository;

@RestController
@RequestMapping("/api/project")
public class ProjectController {

	private final ProjectRepository projectRepository;
	
	public ProjectController(ProjectRepository projectRepository) {
		this.projectRepository = projectRepository;
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
			res.put("contracts", p.getContracts().parallelStream().map(Contract::getContractNumber).collect(Collectors.toList()));
			return res;
		}).collect(Collectors.toList());
	}
	
	@PatchMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody ResponseEntity<Map<String, String>> editProject(@PathVariable Integer id, @RequestBody Map<String, String> data) {
		Map<String, String> body = new HashMap<>();
		Project project = projectRepository.findById(id).orElse(null);
		if(project == null) {
			body.put("error", "project.not.found");
			return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
		}
		if(data.containsKey("name")) 
			project.setName(data.get("name"));
		if(data.containsKey("version")) 
			project.setVersion(data.get("version"));
		if(data.containsKey("dscription")) 
			project.setVersion(data.get("description"));
		projectRepository.save(project);
		body.put("status", "project.updated");
		return new ResponseEntity<Map<String,String>>(body, HttpStatus.OK);
	}
	
	@DeleteMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody ResponseEntity<Map<String, String>> deleteProject(@PathVariable Integer id) {
		Map<String, String> body = new HashMap<>();
		Project project = projectRepository.findById(id).get();
		if(project == null) {
			body.put("error", "project.not.found");
			return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
		}
		if(!project.getContracts().isEmpty()) {
			body.put("error", "project.not.empty");
			return new ResponseEntity<>(body, HttpStatus.CONFLICT);
		} else {
			projectRepository.delete(project);
			body.put("status", "position.deleted");
			return new ResponseEntity<Map<String,String>>(body, HttpStatus.OK);
		}
	}
}
