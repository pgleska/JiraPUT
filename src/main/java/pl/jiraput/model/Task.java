package pl.jiraput.model;

import java.io.Serializable;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name = "task")
public class Task implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = -5123263433535005264L;

	@Column(name = "typ", nullable = false)
	private Integer type;

	@OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	@JoinColumn(name = "issue_id", nullable = false)
	private Issue issueTask;
	
	@ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	@JoinColumn(name = "story_id", referencedColumnName = "issue_id", nullable = false)
	private Story storyTask;
	
	@Id
	@OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	@JoinColumn(name = "prac_login", referencedColumnName = "login", nullable = false)
	private Employee employeeTask;

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

	public Issue getIssue() {
		return issueTask;
	}

	public void setIssue(Issue issueTask) {
		this.issueTask = issueTask;
	}

	public Story getStory() {
		return storyTask;
	}

	public void setStory(Story storyTask) {
		this.storyTask = storyTask;
	}

	public Employee getEmployee() {
		return employeeTask;
	}

	public void setEmployee(Employee employeeTask) {
		this.employeeTask = employeeTask;
	}
}
