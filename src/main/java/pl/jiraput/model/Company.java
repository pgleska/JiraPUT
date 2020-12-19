package pl.jiraput.model;

import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "firma_zewnetrzna")
public class Company {
	@Id
	@Column(name = "nip", unique = true, nullable = false)
	private Integer taxNumber;
	
	@Column(name = "nazwa", unique = true, nullable = false)
	private String name;
	
	@Column(name = "adres", nullable = false)
	private String address;
	
	@OneToMany(mappedBy = "company")
	private Set<Contract> contracts;

	public Company() {}
	
	public Company(Integer taxNumber, String name, String address) {
		this.taxNumber = taxNumber;
		this.name = name;
		this.address = address;
	}
	
	public Integer getTaxNumber() {
		return taxNumber;
	}

	public void setTaxNumber(Integer taxNumber) {
		this.taxNumber = taxNumber;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public Set<Contract> getContracts() {
		return contracts;
	}

	public void setContracts(Set<Contract> contracts) {
		this.contracts = contracts;
	}	
}
