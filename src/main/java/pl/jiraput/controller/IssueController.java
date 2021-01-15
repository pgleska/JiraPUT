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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import pl.jiraput.model.Employee;
import pl.jiraput.model.Epic;
import pl.jiraput.model.Issue;
import pl.jiraput.model.Project;
import pl.jiraput.model.Story;
import pl.jiraput.model.Subtype;
import pl.jiraput.model.Task;
import pl.jiraput.model.Team;
import pl.jiraput.repository.EmployeeRepository;
import pl.jiraput.repository.IssueRepository;
import pl.jiraput.repository.ProjectRepository;
import pl.jiraput.repository.TeamRepository;

@RestController
@RequestMapping("/api/issue")
public class IssueController {

	private static DateTimeFormatter dtf = DateTimeFormatter.ISO_OFFSET_DATE_TIME;
	private final IssueRepository issueRepository;	
	private final EmployeeRepository employeeRepository;
	private final ProjectRepository projectRepository;
	private final TeamRepository teamRepository;
	
	@PersistenceContext
	private EntityManager entityManager;
	
	public IssueController(IssueRepository issueRepository,
			EmployeeRepository employeeRepository,
			ProjectRepository projectRepository, 
			TeamRepository teamRepository) {
		this.issueRepository = issueRepository;
		this.employeeRepository = employeeRepository;
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
				if(issueEpic.getEpic() == null) {
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
			case "task":
				if(!data.containsKey("taskType")) {
					body.put("error", "issue.missing.taskType");
					return new ResponseEntity<Map<String,String>>(body, HttpStatus.CONFLICT);
				}
				if(!data.containsKey("storyId")) {
					body.put("error", "issue.missing.storyId");
					return new ResponseEntity<Map<String,String>>(body, HttpStatus.CONFLICT);
				}
				if(!data.containsKey("userLogin")) {
					body.put("error", "issue.missing.userLogin");
					return new ResponseEntity<Map<String,String>>(body, HttpStatus.CONFLICT);
				}
				Employee emp = employeeRepository.findByLogin(data.get("userLogin").toString());
				if(emp == null) {
					body.put("error", "issue.user.not.found");
					return new ResponseEntity<Map<String,String>>(body, HttpStatus.NOT_FOUND);
				}
				Issue issueStory = issueRepository.findById(Integer.valueOf(data.get("storyId").toString())).orElse(null);
				if(issueStory.getStory() == null) {
					body.put("error", "issue.story.not.found");
					return new ResponseEntity<Map<String,String>>(body, HttpStatus.NOT_FOUND);
				}
				Task task = new Task();
				task.setEmployee(emp);
				task.setStory(issueStory.getStory());
				task.setIssue(issue);
				task.setType(Integer.valueOf(data.get("taskType").toString()));
				issue.setTask(task);
				issue.setSubtype(Subtype.task);
				issueRepository.save(issue);
				break;
			default:
				break;
		}						
		body.put("status", "issue.created");
		return new ResponseEntity<Map<String, String>>(body, HttpStatus.CREATED);
	} 
	
	@GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseStatus(value = HttpStatus.OK)
	public @ResponseBody List<Issue> getAllIssues() {
		return issueRepository.findAll();
	}
	
	@GetMapping(value = "/epic/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody ResponseEntity<Map<String, Object>> getEpic(@PathVariable Integer id) {
		Map<String, Object> body = new HashMap<>();
		Issue issue = issueRepository.findById(id).orElse(null);
		if(issue == null) {
			body.put("error", "issue.not.found");
			return new ResponseEntity<Map<String,Object>>(body, HttpStatus.NOT_FOUND);
		}
		if(issue.getEpic() == null) {
			body.put("error", "issue.epic.not.found");
			return new ResponseEntity<Map<String, Object>>(body, HttpStatus.NOT_FOUND);
		}
		Epic epic = issue.getEpic();
		body.put("id", issue.getId());
		body.put("name", issue.getName());
		body.put("description", issue.getDescription());
		body.put("estimatedTime", issue.getEstimatedTime());
		body.put("realTime", issue.getRealTime());
		body.put("type", issue.getSubtype());
		body.put("projectId", epic.getProject().getId());
		body.put("projectName", epic.getProject().getName());
		body.put("stories", getStoriesId(issue.getId()));
		return new ResponseEntity<Map<String, Object>>(body, HttpStatus.OK);
	}
	
	private List getStoriesId(int id) {
		return entityManager.createNativeQuery("SELECT issue_id FROM story WHERE epic_id=:ID").setParameter("ID", id).getResultList();
	}
	
	@GetMapping(value = "/story/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody ResponseEntity<Map<String, Object>> getStory(@PathVariable Integer id) {
		Map<String, Object> body = new HashMap<>();
		Issue issue = issueRepository.findById(id).orElse(null);
		if(issue == null) {
			body.put("error", "issue.not.found");
			return new ResponseEntity<Map<String,Object>>(body, HttpStatus.NOT_FOUND);
		}
		if(issue.getStory() == null) {
			body.put("error", "issue.story.not.found");
			return new ResponseEntity<Map<String, Object>>(body, HttpStatus.NOT_FOUND);
		}
		Story story = issue.getStory();
		body.put("id", issue.getId());
		body.put("name", issue.getName());
		body.put("description", issue.getDescription());
		body.put("estimatedTime", issue.getEstimatedTime());
		body.put("realTime", issue.getRealTime());
		body.put("type", issue.getSubtype());
		body.put("epicId", getEpicId(id));
		body.put("epicName", getEpicName(id));
		body.put("teamName", story.getTeam().getName());
		body.put("tasks", getTasksId(issue.getId()));
		return new ResponseEntity<Map<String, Object>>(body, HttpStatus.OK);
	}
	
	private Integer getEpicId(int id) {
		return Integer.valueOf(entityManager.createNativeQuery("SELECT epic_id FROM story WHERE issue_id=:ID").setParameter("ID", id).getResultList().get(0).toString());
	}
	
	private String getEpicName(int id) {
		return entityManager.createNativeQuery("SELECT nazwa FROM issue WHERE identyfikator=:ID").setParameter("ID", getEpicId(id)).getResultList().get(0).toString();
	}
	
	private List getTasksId(int id) {
		return entityManager.createNativeQuery("SELECT issue_id FROM task WHERE story_id=:ID").setParameter("ID", id).getResultList();
	}
	
	@GetMapping(value = "/task/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody ResponseEntity<Map<String, Object>> getTask(@PathVariable Integer id) {
		Map<String, Object> body = new HashMap<>();
		Issue issue = issueRepository.findById(id).orElse(null);
		if(issue == null) {
			body.put("error", "issue.not.found");
			return new ResponseEntity<Map<String,Object>>(body, HttpStatus.NOT_FOUND);
		}
		if(issue.getTask() == null) {
			body.put("error", "issue.task.not.found");
			return new ResponseEntity<Map<String, Object>>(body, HttpStatus.NOT_FOUND);
		}
		Task task = issue.getTask();
		body.put("id", issue.getId());
		body.put("name", issue.getName());
		body.put("description", issue.getDescription());
		body.put("estimatedTime", issue.getEstimatedTime());
		body.put("realTime", issue.getRealTime());
		body.put("type", issue.getSubtype());
		body.put("storyId", getStoryId(id));
		body.put("storyName", getStoryName(id));
		body.put("userLogin", task.getEmployee().getLogin());
		body.put("taskType", task.getType());
		return new ResponseEntity<Map<String, Object>>(body, HttpStatus.OK);
	}
	
	private Integer getStoryId(int id) {
		return Integer.valueOf(entityManager.createNativeQuery("SELECT story_id FROM task WHERE issue_id=:ID").setParameter("ID", id).getResultList().get(0).toString());
	}
	
	private String getStoryName(int id) {
		return entityManager.createNativeQuery("SELECT nazwa FROM issue WHERE identyfikator=:ID").setParameter("ID", getStoryId(id)).getResultList().get(0).toString();
	}
}
