package pl.jiraput.controller;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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
}
