package pl.jiraput.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import pl.jiraput.model.Technology;

@Repository
public interface TechnologyRepository extends JpaRepository<Technology, String> {
	Technology findByName(String name);
}
