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
@Table(name = "kontrakt")
public class Contract {
	@Id
	@Column(name = "numer_umowy", unique = true, nullable = false)
	private String contractNumber;
	
	@Column(name = "kwota", nullable = false)
	private Float amount;
	
	@Column(name = "opis_warunkow")
	private String conditions;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "firma_zew", nullable = false)
	@JsonIgnore
	private Company company;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "projekt", nullable = false)
	@JsonIgnore
	private Project project;

	public Contract() {}
	
	public Contract(String contractNumber, Float amount, Company company, Project project) {
		this.contractNumber = contractNumber;
		this.amount = amount;
		this.company = company;
		this.project = project;
	}
	
	public Contract(String contractNumber, Float amount, String conditions, Company company, Project project) {
		this(contractNumber, amount, company, project);
		this.conditions = conditions;
	}
	
	public String getContractNumber() {
		return contractNumber;
	}

	public void setContractNumber(String contractNumber) {
		this.contractNumber = contractNumber;
	}

	public Float getAmount() {
		return amount;
	}

	public void setAmount(Float amount) {
		this.amount = amount;
	}

	public String getConditions() {
		return conditions;
	}

	public void setConditions(String conditions) {
		this.conditions = conditions;
	}

	public Company getCompany() {
		return company;
	}

	public void setCompany(Company company) {
		this.company = company;
	}

	public Project getProject() {
		return project;
	}

	public void setProject(Project project) {
		this.project = project;
	}
}
