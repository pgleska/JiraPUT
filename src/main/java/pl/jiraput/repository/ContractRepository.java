package pl.jiraput.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import pl.jiraput.model.Contract;

@Repository
public interface ContractRepository extends JpaRepository<Contract, String> {
	Contract findByContractNumber(String contractNumber);
}
