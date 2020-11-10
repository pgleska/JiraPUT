package pl.jiraput.model;

import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "stanowisko")
public class Position {
	@Id
	@Column(name = "nazwa", unique = true, nullable = false)	
	private String name;
	
	@Column(name = "pensja_minimalna", nullable = false)
	private int minimumSalary;
	
	@Column(name = "pensja_maksymalna", nullable = false)
	private int maximumSalary;
	
	@JsonIgnore
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "position")
	private Set<Employee> employees;
	
	public Position() {
		
	}
	
	public Position(String name) {
		this.name = name;
	}
	
	public Position(String name, int minimumSalary, int maximumSalary) {
		this(name);
		this.minimumSalary = minimumSalary;
		this.maximumSalary = maximumSalary;
	}
	
	public String getName() {
		return name;
	}
	
	public int getMinimumSalary() {
		return minimumSalary;
	}
	
	public int getMaximumSalary() {
		return maximumSalary;
	}
	
	public Set<Employee> getEmployees() {
		return employees;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public void setMinimumSalary(int minimumSalary) {
		this.minimumSalary = minimumSalary;
	}
	
	public void setMaximumSalary(int maximumSalary) {
		this.maximumSalary = maximumSalary;
	}
}
