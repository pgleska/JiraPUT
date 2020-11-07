package pl.jiraput.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "pracownik")
public class Employee {	
	@Id
	@Column(name = "identyfikator", unique = true, nullable = false)
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@Column(name = "imie", nullable = false)
	private String firstName;
	
	@Column(name = "nazwisko", unique = true, nullable = false)
	private String lastName;
	
	@Column(name = "login", unique = true, nullable = false)
	private String login;
	
	@Column(name = "token")
	private String token;
	
	@Column(name = "haslo", nullable = false)
	private String password;
	
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
		
	public Integer getId() {
		return id;
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
	
	@JsonIgnore
	public Team getTeam() {
		return team;
	}

	public void setId(int id) {
		this.id = id;
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
	
	public void setTeam(Team team) {
		this.team = team;
	}
}
