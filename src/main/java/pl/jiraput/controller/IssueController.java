package pl.jiraput.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

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
					if(data.containsKey("realizationDate")) {
						String realizationDate = data.get("realizationDate").toString();
						epic.setRealizationDate(LocalDateTime.parse(realizationDate, dtf));
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
				if(!data.containsKey("teamName")) {
					body.put("error", "issue.missing.teamName");
					return new ResponseEntity<Map<String,String>>(body, HttpStatus.CONFLICT);
				}
				Issue issueEpic = issueRepository.findById(Integer.valueOf(data.get("epicId").toString())).orElse(null);
				if(issueEpic.getEpic() == null) {
					body.put("error", "issue.epic.not.found");
					return new ResponseEntity<Map<String,String>>(body, HttpStatus.NOT_FOUND);
				}
				Team team = teamRepository.findByName(data.get("teamName").toString());
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
	public @ResponseBody List<Map<String, Object>> getAllIssues() {
		List<Map<String, Object>> body = new ArrayList<>();
		for(Issue issue : issueRepository.findAll()) {
			Map<String, Object> res = new HashMap<>();
			res.put("id", issue.getId());
			res.put("name", issue.getName());
			res.put("description", issue.getDescription());
			res.put("estimatedTime", issue.getEstimatedTime());
			res.put("realTime", issue.getRealTime());
			res.put("type", issue.getSubtype());			
			calculateTimeDifference(issue.getId(), res);
			body.add(res);
		}
		
		return body;
	}	
	
	@GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Map<String, Object>> getIssue(@PathVariable Integer id) {
		Map<String, Object> body = new HashMap<>();
		Issue issue = issueRepository.findById(id).orElse(null);
		if(issue == null) {
			body.put("error", "issue.not.found");
			return new ResponseEntity<Map<String,Object>>(body, HttpStatus.NOT_FOUND);
		}

		body.put("id", issue.getId());
		body.put("name", issue.getName());
		body.put("description", issue.getDescription());
		body.put("estimatedTime", issue.getEstimatedTime());
		body.put("realTime", issue.getRealTime());
		calculateTimeDifference(issue.getId(), body);
		body.put("type", issue.getSubtype());

		switch (issue.getSubtype()) {
			case epic:
				Epic epic = issue.getEpic();
				if(epic == null) {
					body.put("error", "issue.epic.not.found");
					return new ResponseEntity<Map<String, Object>>(body, HttpStatus.NOT_FOUND);
				}
				body.put("projectId", epic.getProject().getId());
				body.put("projectName", epic.getProject().getName());
				body.put("stories", getStoriesId(issue.getId()));
				body.put("realizationDate", epic.getRealizationDate());
				break;
			case story:
				Story story = issue.getStory();
				if(story == null) {
					body.put("error", "issue.story.not.found");
					return new ResponseEntity<Map<String, Object>>(body, HttpStatus.NOT_FOUND);
				}
				body.put("epicId", getEpicId(id));
				body.put("epicName", getEpicName(id));
				body.put("teamName", story.getTeam().getName());
				body.put("tasks", getTasksId(issue.getId()));
				break;
			case task:
				Task task = issue.getTask();
				if(task == null) {
					body.put("error", "issue.task.not.found");
					return new ResponseEntity<Map<String, Object>>(body, HttpStatus.NOT_FOUND);
				}
				body.put("storyId", getStoryId(id));
				body.put("storyName", getStoryName(id));
				body.put("userLogin", task.getEmployee().getLogin());
				body.put("taskType", task.getType());
		}
		return new ResponseEntity<Map<String, Object>>(body, HttpStatus.OK);
	}
	
	@GetMapping(value = "/project/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<Map<String, Object>>> getEpicsFromProject(@PathVariable Integer id) {
		List<Map<String, Object>> body = new ArrayList<>();
		
		Project project = projectRepository.findById(id).orElse(null);
		if(project == null) {
			Map<String, Object> res = new HashMap<>();
			res.put("error", "issue.project.not.found");
			body.add(res);
			return new ResponseEntity<List<Map<String, Object>>>(body, HttpStatus.NOT_FOUND);
		}
		
		List<Issue> issues = issueRepository.findAll();
		List<Issue> epics = issues.stream().filter(i -> i.getSubtype().equals(Subtype.epic)).collect(Collectors.toList());
		
		for(Issue issue : epics) {
			Epic epic = issue.getEpic();
			if(epic.getProject().getId() == id) {
				Map<String, Object> res = new HashMap<>();
				res.put("id", issue.getId());
				res.put("name", issue.getName());
				res.put("description", issue.getDescription());
				res.put("estimatedTime", issue.getEstimatedTime());
				res.put("realTime", issue.getRealTime());
				res.put("type", issue.getSubtype());
				res.put("projectId", epic.getProject().getId());
				res.put("projectName", epic.getProject().getName());
				res.put("stories", getStoriesId(issue.getId()));
				res.put("realizationDate", epic.getRealizationDate());
				calculateTimeDifference(issue.getId(), res);
				body.add(res);
			}
		}		

		return new ResponseEntity<List<Map<String, Object>>>(body, HttpStatus.OK);
	}
	
	@GetMapping(value = "/team/{name}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<Map<String, Object>>> getStoriesFromTeam(@PathVariable String name) {
		List<Map<String, Object>> body = new ArrayList<>(); 
		
		Team team = teamRepository.findByName(name);
		if(team == null) {
			Map<String, Object> res = new HashMap<>();
			res.put("error", "issue.team.not.found");
			body.add(res);
			return new ResponseEntity<List<Map<String, Object>>>(body, HttpStatus.NOT_FOUND);
		}
		
		List<Issue> issues = issueRepository.findAll();
		List<Issue> stories = issues.stream().filter(i -> i.getSubtype().equals(Subtype.story)).collect(Collectors.toList());
		
		for(Issue issue : stories) {
			Story story = issue.getStory();
			if(story.getTeam().getName().equals(name)) {
				Map<String, Object> res = new HashMap<>();
				res.put("id", issue.getId());
				res.put("name", issue.getName());
				res.put("description", issue.getDescription());
				res.put("estimatedTime", issue.getEstimatedTime());
				res.put("realTime", issue.getRealTime());
				res.put("type", issue.getSubtype());
				res.put("epicId", getEpicId(issue.getId()));
				res.put("epicName", getEpicName(issue.getId()));
				res.put("teamName", story.getTeam().getName());
				res.put("tasks", getTasksId(issue.getId()));
				calculateTimeDifference(issue.getId(), res);
				body.add(res);
			}
		}		

		return new ResponseEntity<List<Map<String, Object>>>(body, HttpStatus.OK);
	}
	
	@GetMapping(value = "/user/{login}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<Map<String, Object>>> getTasksFromUser(@PathVariable String login) {
		List<Map<String, Object>> body = new ArrayList<>(); 
		
		Employee emp = employeeRepository.findByLogin(login);
		if(emp == null ) {
			Map<String, Object> res = new HashMap<>();
			res.put("error", "issue.user.not.found");
			body.add(res);
			return new ResponseEntity<List<Map<String, Object>>>(body, HttpStatus.NOT_FOUND);
		}
		
		List<Issue> issues = issueRepository.findAll();
		List<Issue> tasks = issues.stream().filter(i -> i.getSubtype().equals(Subtype.task)).collect(Collectors.toList());
		
		for(Issue issue : tasks) {
			Task task = issue.getTask();
			if(task.getEmployee().getLogin().equals(login)) {
				Map<String, Object> res = new HashMap<>();
				res.put("id", issue.getId());
				res.put("name", issue.getName());
				res.put("description", issue.getDescription());
				res.put("estimatedTime", issue.getEstimatedTime());
				res.put("realTime", issue.getRealTime());
				res.put("type", issue.getSubtype());
				res.put("storyId", getStoryId(issue.getId()));
				res.put("storyName", getStoryName(issue.getId()));
				res.put("userLogin", task.getEmployee().getLogin());
				res.put("taskType", task.getType());
				calculateTimeDifference(issue.getId(), res);
				body.add(res);
			}
		}
	
		return new ResponseEntity<List<Map<String, Object>>>(body, HttpStatus.OK);
	}
	
	@Transactional
	@DeleteMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Map<String, String>> deleteIssue(@PathVariable Integer id) {
		Map<String, String> body = new HashMap<>();
		Issue issue = issueRepository.findById(id).orElse(null);
		if(issue == null) {
			body.put("error", "issue.not.found");
			return new ResponseEntity<Map<String,String>>(body, HttpStatus.NOT_FOUND);
		}
		switch(issue.getSubtype()) {
			case epic:
				List stories = getStoriesId(issue.getId());
				if(!stories.isEmpty()) {
					body.put("error", "issue.not.empty");
					return new ResponseEntity<>(body, HttpStatus.CONFLICT);
				}
				entityManager.createNativeQuery("DELETE FROM epic WHERE issue_id=:ID").setParameter("ID", id).executeUpdate();
				break;
			case story:
				List tasks = getTasksId(issue.getId());
				if(!tasks.isEmpty()) {
					body.put("error", "issue.not.empty");
					return new ResponseEntity<>(body, HttpStatus.CONFLICT);
				}
				entityManager.createNativeQuery("DELETE FROM story WHERE issue_id=:ID").setParameter("ID", id).executeUpdate();
				break;
			case task:
				entityManager.createNativeQuery("DELETE FROM task WHERE issue_id=:ID").setParameter("ID", id).executeUpdate();
				break;
		}
		entityManager.createNativeQuery("DELETE FROM issue WHERE identyfikator=:ID").setParameter("ID", id).executeUpdate();
		body.put("status", "issue.deleted");
		return new ResponseEntity<Map<String, String>>(body, HttpStatus.OK);
	}
	
	@PatchMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Map<String, String>> updateIssue(@PathVariable Integer id, @RequestBody Map<String, Object> data) {
		Map<String, String> body = new HashMap<>();
		Issue issue = issueRepository.findById(id).orElse(null);
		if(issue == null) {
			body.put("error", "issue.not.found");
			return new ResponseEntity<Map<String, String>>(body, HttpStatus.NOT_FOUND);
		}
		if(data.containsKey("name")) {
			issue.setName(data.get("name").toString());
		}
		if(data.containsKey("description")) {
			if(data.get("description") != null)
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
		switch(issue.getSubtype()) {
			case epic:
				Epic epic = issue.getEpic();
				if(data.containsKey("projectId")) {		
					Project p = projectRepository.findById(Integer.valueOf(data.get("projectId").toString())).orElse(null);
					if(p == null ) {
						body.put("error", "issue.project.not.found");
						return new ResponseEntity<Map<String,String>>(body, HttpStatus.NOT_FOUND);
					}
					epic.setProject(p);
				}										
				if(data.containsKey("realizationDate")) {
					String realizationDate = data.get("realizationDate").toString();
					epic.setRealizationDate(LocalDateTime.parse(realizationDate, dtf));
				}				
				epic.setIssue(issue);
				issue.setEpic(epic);
				issueRepository.save(issue);																										
				break;
			case story:
				Story story = issue.getStory();
				if(data.containsKey("epicId")) {
					Issue issueEpic = issueRepository.findById(Integer.valueOf(data.get("epicId").toString())).orElse(null);
					if(issueEpic.getEpic() == null) {
						body.put("error", "issue.epic.not.found");
						return new ResponseEntity<Map<String,String>>(body, HttpStatus.NOT_FOUND);
					}
					story.setEpic(issueEpic.getEpic());
				}
				if(data.containsKey("teamName")) {
					Team team = teamRepository.findByName(data.get("teamName").toString());
					if(team == null) {
						body.put("error", "issue.team.not.found");
						return new ResponseEntity<Map<String,String>>(body, HttpStatus.NOT_FOUND);
					}
					story.setTeam(team);
				}																
				story.setIssue(issue);				
				issue.setStory(story);
				issueRepository.save(issue);
				break;
			case task:
				Task task = issue.getTask();
				if(data.containsKey("taskType")) {
					task.setType(Integer.valueOf(data.get("taskType").toString()));
				}
				if(data.containsKey("storyId")) {
					Issue issueStory = issueRepository.findById(Integer.valueOf(data.get("storyId").toString())).orElse(null);
					if(issueStory.getStory() == null) {
						body.put("error", "issue.story.not.found");
						return new ResponseEntity<Map<String,String>>(body, HttpStatus.NOT_FOUND);
					}							
					task.setStory(issueStory.getStory());
				}
				if(data.containsKey("userLogin")) {
					Employee emp = employeeRepository.findByLogin(data.get("userLogin").toString());
					if(emp == null) {
						body.put("error", "issue.user.not.found");
						return new ResponseEntity<Map<String,String>>(body, HttpStatus.NOT_FOUND);
					}
					task.setEmployee(emp);
				}												
				task.setIssue(issue);				
				issue.setTask(task);
				issueRepository.save(issue);
				break;
			default:
				break;
		}						
		body.put("status", "issue.updated");
		return new ResponseEntity<Map<String, String>>(body, HttpStatus.OK);
	}
	
	private void calculateTimeDifference(int id, Map<String, Object> map) {
		Object result = entityManager.createNativeQuery("SELECT roznica_czasow(:ID)").setParameter("ID", id).getSingleResult();
		if(result != null)
			map.put("timeDifference", result);
	}
	
	private List getStoriesId(int id) {
		return entityManager.createNativeQuery("SELECT issue_id FROM story WHERE epic_id=:ID").setParameter("ID", id).getResultList();
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
	
	private Integer getStoryId(int id) {
		return Integer.valueOf(entityManager.createNativeQuery("SELECT story_id FROM task WHERE issue_id=:ID").setParameter("ID", id).getResultList().get(0).toString());
	}
	
	private String getStoryName(int id) {
		return entityManager.createNativeQuery("SELECT nazwa FROM issue WHERE identyfikator=:ID").setParameter("ID", getStoryId(id)).getResultList().get(0).toString();
	}
}
