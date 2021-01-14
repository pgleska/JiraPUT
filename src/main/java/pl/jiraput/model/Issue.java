package pl.jiraput.model;

import java.time.LocalDateTime;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "issue")
public class Issue {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "identyfikator", nullable = false, unique = true)
	private Integer id;
	
	@Column(name = "nazwa", nullable = false)
	private String name;
	
	@Column(name = "opis")
	private String description;
	
	@Column(name = "szacunkowy_czas_trwania")
	private LocalDateTime estimatedTime;
	
	@Column(name = "rzeczywisty_czas_trwania")
	private LocalDateTime realTime;
	
	@Column(name = "podtyp")
	@Enumerated(EnumType.STRING)
	private Subtype subtype;
	
	@OneToOne(fetch = FetchType.LAZY, mappedBy = "issueEpic", cascade = CascadeType.ALL)
	@JsonIgnore
	private Epic epic;
	
	@OneToOne(fetch = FetchType.LAZY, mappedBy = "issueStory", cascade = CascadeType.ALL)
	@JsonIgnore
	private Story story;

	public Issue() {}	
	
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public LocalDateTime getEstimatedTime() {
		return estimatedTime;
	}

	public void setEstimatedTime(LocalDateTime estimatedTime) {
		this.estimatedTime = estimatedTime;
	}

	public LocalDateTime getRealTime() {
		return realTime;
	}

	public void setRealTime(LocalDateTime realTime) {
		this.realTime = realTime;
	}

	public Subtype getSubtype() {
		return subtype;
	}

	public void setSubtype(Subtype subtype) {
		this.subtype = subtype;
	}

	public Epic getEpic() {
		return epic;
	}

	public void setEpic(Epic epic) {
		this.epic = epic;
	}

	public Story getStory() {
		return story;
	}

	public void setStory(Story story) {
		this.story = story;
	}
}
