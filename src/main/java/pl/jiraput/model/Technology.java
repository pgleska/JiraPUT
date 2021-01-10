package pl.jiraput.model;

import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "technologia")
public class Technology {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "identyfikator", nullable = false, unique = true)
	private Integer id;
	
	@Column(name = "nazwa", nullable = false, unique = true)
	private String name;
	
	@JsonIgnore
	@ManyToMany(targetEntity = Employee.class, mappedBy = "technologies", fetch = FetchType.LAZY)
	private Set<Employee> employees;
	
	@JsonIgnore
	@ManyToMany(targetEntity = Project.class, mappedBy = "technologies", fetch = FetchType.LAZY)
	private Set<Project> projects;
	
	public Technology() {}
	
	public Technology(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Set<Employee> getEmployees() {
		return employees;
	}

	public void setProjects(Set<Project> projects) {
		this.projects = projects;
	}
	
	public Set<Project> getProjects() {
		return projects;
	}

	public void setEmployees(Set<Employee> employees) {
		this.employees = employees;
	}
	
	public Integer getId() {
		return id;
	}
}
