package pl.jiraput.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import pl.jiraput.model.Position;
import pl.jiraput.repository.PositionRepository;

@RestController
@RequestMapping("/api/position")
public class PositionController {

	@Autowired
	private PositionRepository positionRepository;
	
	@GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseStatus(value = HttpStatus.OK)
	public @ResponseBody List<Position> getAllPositions() {
		return positionRepository.findAll();
	}
	
	@PostMapping(value = "/create", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody Map<String, String> createPosition(@RequestBody Position position) {
		Map<String, String> response = new HashMap<>();
		if(positionRepository.findByName(position.getName()) == null) {
	    	positionRepository.save(position);
	    	response.put("status", "position.created");
	    	return response;
		} else {
			response.put("status", "position.duplicated");
			return response;
		}
	}
	
	@PatchMapping(value = "/{name}/edit", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody Map<String, String> editPosition(@PathVariable String name, @RequestBody Map<String, Integer> data) {
		Map<String, String> response = new HashMap<>();
		Position position = positionRepository.findByName(name);
		if(position != null) {
	    	position.setMinimumSalary(data.get("minimum"));
	    	position.setMaximumSalary(data.get("maximum"));
	    	positionRepository.save(position);
	    	response.put("status", "position.edited");
	    	return response;
		} else {
			response.put("status", "position.not.exist");
			return response;
		}
	}
}
