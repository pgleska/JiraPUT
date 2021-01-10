package pl.jiraput.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import pl.jiraput.model.Employee;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, String> {
	Employee findByLogin(String login);
	List<Employee> findByPosition(String position);
}
