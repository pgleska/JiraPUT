package pl.jiraput.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import pl.jiraput.model.Company;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Integer> {
	Company findByTaxNumber(Integer taxNumber);
	Company findByName(String name);
}
