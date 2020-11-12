package pl.jiraput.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "pracownik")
public class Employee {	
	@Id
	@Column(name = "login", unique = true, nullable = false)
	private String login;
	
	@Column(name = "imie", nullable = false)
	private String firstName;
	
	@Column(name = "nazwisko", unique = true, nullable = false)
	private String lastName;
	
	@Column(name = "token")
	private String token;
	
	@Column(name = "haslo", nullable = false)
	private String password;
	
	@Column(name = "pensja", nullable = false)
	private float salary;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "stanowisko", nullable = false)	
	private Position position;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "zespol", nullable = false)	
	private Team team;
	
	public Employee() {
		
	}
	
	public Employee(String login, String password, String firstName, String lastName) {
		this.login = login;
		this.password = password;
		this.firstName = firstName;
		this.lastName = lastName;	
	}
	
	public Employee(String login, String password, String firstName, String lastName, Team team) {
		this.login = login;
		this.password = password;
		this.firstName = firstName;
		this.lastName = lastName;
		this.team = team;
	}
		
	public String getFirstName() {
		return firstName;
	}
	
	public String getLastName() {		
		return lastName;
	}
	
	public String getLogin() {
		return login;
	}
		
	public String getToken() {
		return token;
	}
	
	public String getPassword() {
		return password;
	}
	
	public float getSalary() {
		return salary;
	}
	
	@JsonIgnore
	public Position getPosition() {
		return position;
	}
	
	@JsonIgnore
	public Team getTeam() {
		return team;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public void setLogin(String login) {
		this.login = login;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public void setPassword(String password) {
		this.password = password;
	}
	
	public void setSalary(float salary) {
		this.salary = salary;
	}
	
	public void setPosition(Position position) {
		this.position = position;
	}
	
	public void setTeam(Team team) {
		this.team = team;
	}
}
