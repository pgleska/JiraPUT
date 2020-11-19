package pl.jiraput.controller;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import javax.persistence.EntityManager;
import javax.persistence.ParameterMode;
import javax.persistence.PersistenceContext;
import javax.persistence.StoredProcedureQuery;

import org.springframework.beans.factory.annotation.Autowired;
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

import pl.jiraput.model.Team;
import pl.jiraput.repository.TeamRepository;

@RestController
@RequestMapping("/api/team")
public class TeamController {
	
	@Autowired
	private TeamRepository teamRepository;
	
	@PersistenceContext
	private EntityManager entityManager;
	
	@PostMapping(value = "/create", consumes = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody ResponseEntity<Map<String, String>> createTeam(@RequestBody Team team) {
		Map<String, String> body = new HashMap<>();
		if(teamRepository.findByName(team.getName()) == null) {
	    	teamRepository.save(team);
	    	body.put("status", "team.created");
	    	return new ResponseEntity<>(body, HttpStatus.CREATED);
		} else {
			body.put("error", "team.duplicated");
			return new ResponseEntity<>(body, HttpStatus.CONFLICT);
		}
	}
	
	@GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseStatus(value = HttpStatus.OK)
	public @ResponseBody List<Map<String, Object>> getAllTeams() {
		Function<Team, Map<String, Object>> func = t -> {
			Map<String, Object> body = new HashMap<>();
			body.put("name", t.getName());
			body.put("numberOfMembers", t.getNumberOfMembers());
			Set<String> members = new HashSet<>();
			t.getMembers().forEach(m -> members.add(m.getLogin()));
			body.put("members", members);
			return body;
		};		
		return teamRepository.findAll().stream().map(func).collect(Collectors.toList());
	}
	
	@GetMapping(value = "/{name}", produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody ResponseEntity<Map<String, Object>> getTeamInfo(@PathVariable String name) {	
		Map<String, Object> body = new HashMap<>();
		Team team = teamRepository.findByName(name);
		if(team != null) {
			body.put("name", team.getName());
			body.put("numberOfMembers", team.getNumberOfMembers());
			Set<String> members = new HashSet<>();
			team.getMembers().forEach(m -> members.add(m.getLogin()));
			body.put("members", members);
			return new ResponseEntity<>(body, HttpStatus.OK);
		} else {
			body.put("error", "team.not.found");
			return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
		}
	}
	
	@PatchMapping(value = "/{name}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody ResponseEntity<Map<String, String>> editTeam(@PathVariable String name, @RequestBody Map<String, String> data) {
		Map<String, String> body = new HashMap<>();
		Team oldTeam = teamRepository.findByName(name);
		if(oldTeam == null) {
			body.put("error", "team.not.found");
			return new ResponseEntity<Map<String,String>>(body, HttpStatus.NOT_FOUND);
		}
		String newName = data.get("name");
		if(teamRepository.findByName(newName) != null) {
			body.put("error", "team.duplicated");
			return new ResponseEntity<Map<String,String>>(body, HttpStatus.CONFLICT);
		} else {								
			StoredProcedureQuery query = entityManager.createStoredProcedureQuery("zmien_nazwe_zespolu")
				.registerStoredProcedureParameter("stary", String.class, ParameterMode.IN)
				.registerStoredProcedureParameter("nowy", String.class, ParameterMode.IN);
			
			query.setParameter("stary", name)
				.setParameter("nowy", newName);
			
			query.execute();			
			
			body.put("status", "team.edited");
			return new ResponseEntity<Map<String,String>>(body, HttpStatus.OK);
		}		
	}
	
	@DeleteMapping(value = "/{name}", produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody ResponseEntity<Map<String, String>> deleteTeam(@PathVariable String name) {
		Map<String, String> body = new HashMap<>();
		Team team = teamRepository.findByName(name);
		if(team == null) {
			body.put("error", "team.not.found");
			return new ResponseEntity<Map<String,String>>(body, HttpStatus.NOT_FOUND);
		}
		if(team.getMembers().size() > 0) {
			body.put("error", "team.not.empty");
			return new ResponseEntity<Map<String,String>>(body, HttpStatus.CONFLICT);
		} else {
			teamRepository.delete(team);
			body.put("status", "team.deleted");
			return new ResponseEntity<Map<String,String>>(body, HttpStatus.OK);
		}
	}
}
