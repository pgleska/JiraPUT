package pl.jiraput.model;

import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "projekt")
public class Project {	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "identyfikator", unique = true, nullable = false)
	private Integer id;
	
	@Column(name = "nazwa", unique = true, nullable = false)
	private String name;
	
	@Column(name = "wersja", unique = true)
	private String version;
	
	@Column(name = "opis")
	private String description;
	
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "project")
	private Set<Contract> contracts;

	@ManyToMany(targetEntity = Technology.class, fetch = FetchType.LAZY)
    @JoinTable(
        name = "tech_proj",
        joinColumns = @JoinColumn(name = "proj_id"),
        inverseJoinColumns = @JoinColumn(name = "tech_id")
    )
	private Set<Technology> technologies;
	
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "projectEpic", cascade = CascadeType.ALL)
	private Set<Epic> epics;
	
	public Project() {}
	
	public Project(String version, String description) {
		this.version = version;
		this.description = description;
	}
	
	public Project(String name, String version, String description) {
		this(version, description);
		this.name = name;
	}
	
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

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Set<Contract> getContracts() {
		return contracts;
	}

	public void setContracts(Set<Contract> contracts) {
		this.contracts = contracts;
	}

	public Set<Technology> getTechnologies() {
		return technologies;
	}

	public void setTechnologies(Set<Technology> technologies) {
		this.technologies = technologies;
	}

	public Set<Epic> getEpics() {
		return epics;
	}

	public void setEpics(Set<Epic> epic) {
		this.epics = epic;
	}
}
