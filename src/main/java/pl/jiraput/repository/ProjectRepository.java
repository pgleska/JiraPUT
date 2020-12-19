package pl.jiraput.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import pl.jiraput.model.Project;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Integer> {
	Project findByName(String name);
}
