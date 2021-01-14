package pl.jiraput.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import pl.jiraput.model.Epic;
import pl.jiraput.model.Issue;
import pl.jiraput.model.Project;
import pl.jiraput.model.Story;
import pl.jiraput.model.Subtype;
import pl.jiraput.model.Team;
import pl.jiraput.repository.IssueRepository;
import pl.jiraput.repository.ProjectRepository;
import pl.jiraput.repository.TeamRepository;

@RestController
@RequestMapping("/api/issue")
public class IssueController {

	private static DateTimeFormatter dtf = DateTimeFormatter.ISO_OFFSET_DATE_TIME;
	private final IssueRepository issueRepository;	
	private final ProjectRepository projectRepository;
	private final TeamRepository teamRepository;
	
	@PersistenceContext
	private EntityManager entityManager;
	
	public IssueController(IssueRepository issueRepository, ProjectRepository projectRepository, TeamRepository teamRepository) {
		this.issueRepository = issueRepository;
		this.projectRepository = projectRepository;
		this.teamRepository = teamRepository;
	}
	
	@PostMapping(value = "/create", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody ResponseEntity<Map<String, String>> createIssue(@RequestBody Map<String, Object> data) {
		Map<String, String> body = new HashMap<>();
		Issue issue = new Issue();
		String type;
		if(data.containsKey("name")) {
			issue.setName(data.get("name").toString());
		} else {
			body.put("error", "issue.missing.name");
			return new ResponseEntity<Map<String,String>>(body, HttpStatus.CONFLICT);
		}
		if(data.containsKey("type")) {
			type = data.get("type").toString();
		} else {
			body.put("error", "issue.missing.type");
			return new ResponseEntity<Map<String,String>>(body, HttpStatus.CONFLICT);
		}
		if(data.containsKey("description")) {
			issue.setDescription(data.get("description").toString());
		}
		if(data.containsKey("estimatedTime")) {
			String estimatedTime = data.get("estimatedTime").toString();
			issue.setEstimatedTime(LocalDateTime.parse(estimatedTime, dtf));
		}
		if(data.containsKey("realTime")) {
			String realTime = data.get("realTime").toString();
			issue.setRealTime(LocalDateTime.parse(realTime, dtf));
		}
		switch(type) {
			case "epic":
				if(data.containsKey("projectId")) {					
					Epic epic = new Epic();
					Project p = projectRepository.findById(Integer.valueOf(data.get("projectId").toString())).orElse(null);
					if(p == null ) {
						body.put("error", "issue.project.not.found");
						return new ResponseEntity<Map<String,String>>(body, HttpStatus.NOT_FOUND);
					}
					epic.setProject(p);
					epic.setIssue(issue);
					issue.setEpic(epic);
					issue.setSubtype(Subtype.epic);
					issueRepository.save(issue);																						
				} else {
					body.put("error", "issue.missing.projectId");
					return new ResponseEntity<Map<String,String>>(body, HttpStatus.CONFLICT);
				}
				break;
			case "story":
				if(!data.containsKey("epicId")) {
					body.put("error", "issue.missing.epicId");
					return new ResponseEntity<Map<String,String>>(body, HttpStatus.CONFLICT);
				}
				if(!data.containsKey("team")) {
					body.put("error", "issue.missing.teamName");
					return new ResponseEntity<Map<String,String>>(body, HttpStatus.CONFLICT);
				}
				Issue issueEpic = issueRepository.findById(Integer.valueOf(data.get("epicId").toString())).orElse(null);
				if(issueEpic == null) {
					body.put("error", "issue.epic.not.found");
					return new ResponseEntity<Map<String,String>>(body, HttpStatus.NOT_FOUND);
				}
				Team team = teamRepository.findByName(data.get("team").toString());
				if(team == null) {
					body.put("error", "issue.team.not.found");
					return new ResponseEntity<Map<String,String>>(body, HttpStatus.NOT_FOUND);
				}
				Story story = new Story();
				story.setEpic(issueEpic.getEpic());
				story.setIssue(issue);
				story.setTeam(team);
				issue.setStory(story);
				issue.setSubtype(Subtype.story);
				issueRepository.save(issue);
				break;
			default:
				break;
		}						
		body.put("status", "issue.created");
		return new ResponseEntity<Map<String,String>>(body, HttpStatus.CREATED);
	} 
	
	@GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseStatus(value = HttpStatus.OK)
	public @ResponseBody List<Issue> getAllIssues() {
		return issueRepository.findAll();
	}
}
