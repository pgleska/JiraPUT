package pl.jiraput.model;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name = "epic")
public class Epic implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -5558542756071716520L;

	@Column(name = "termin_realizacji")
	private LocalDateTime realizationDate;
	
	@OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	@JoinColumn(name = "projekt_id", nullable = false)	
	private Project projectEpic;
	
	@Id
	@OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	@JoinColumn(name = "issue_id", nullable = false)
	private Issue issueEpic;
	
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "epicStory")
	private Set<Story> stories;

	public LocalDateTime getRealizationDate() {
		return realizationDate;
	}

	public void setRealizationDate(LocalDateTime realizationDate) {
		this.realizationDate = realizationDate;
	}
	
	public Project getProject() {
		return projectEpic;
	}

	public void setProject(Project project) {
		this.projectEpic = project;
	}

	public Issue getIssue() {
		return issueEpic;
	}

	public void setIssue(Issue issue) {
		this.issueEpic = issue;
	}

	public Project getProjectEpic() {
		return projectEpic;
	}

	public void setProjectEpic(Project projectEpic) {
		this.projectEpic = projectEpic;
	}

	public Issue getIssueEpic() {
		return issueEpic;
	}

	public void setIssueEpic(Issue issueEpic) {
		this.issueEpic = issueEpic;
	}

	public Set<Story> getStories() {
		return stories;
	}

	public void setStories(Set<Story> stories) {
		this.stories = stories;
	}
}
