package pl.jiraput.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import pl.jiraput.model.Company;

import java.math.BigInteger;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Integer> {
	Company findByTaxNumber(BigInteger taxNumber);
	Company findByName(String name);
}
