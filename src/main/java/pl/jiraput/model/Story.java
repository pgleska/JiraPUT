package pl.jiraput.model;

import java.io.Serializable;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name = "story")
public class Story implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 2958663300486760252L;
	
	@Id
	@OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	@JoinColumn(name = "issue_id", nullable = false)
	private Issue issueStory;
	
	@ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	@JoinColumn(name = "zespol", nullable = false)
	private Team teamStory;
	
	@ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	@JoinColumn(name = "epic_id", referencedColumnName = "issue_id", nullable = false)
	private Epic epicStory;

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "storyTask")
	private Set<Task> tasks;
	
	public Issue getIssue() {
		return issueStory;
	}

	public void setIssue(Issue issueStory) {
		this.issueStory = issueStory;
	}

	public Team getTeam() {
		return teamStory;
	}

	public void setTeam(Team team) {
		this.teamStory = team;
	}

	public Epic getEpic() {
		return epicStory;
	}

	public void setEpic(Epic epicStory) {
		this.epicStory = epicStory;
	}
}
