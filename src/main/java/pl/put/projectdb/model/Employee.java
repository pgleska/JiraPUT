package pl.put.projectdb.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "pracownik")
public class Employee implements IBasicEmployee {	
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
	
	public Employee() {
		
	}
	
	public Employee(String login, String password) {
		this.login = login;
		this.password = password;
	}
	
	public Employee(String login, String password, String firstName, String lastName) {
		this(login,password);
		this.firstName = firstName;
		this.lastName = lastName;
	}
	
	@Override
	public Integer getId() {
		return id;
	}
	
	@Override
	public String getFirstName() {
		return firstName;
	}
	
	@Override
	public String getLastName() {		
		return lastName;
	}
	
	@Override
	public String getLogin() {
		return login;
	}
	
	@Override
	public String getToken() {
		return token;
	}
	
	public String getPassword() {
		return password;
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
}
