package pl.jiraput.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import pl.jiraput.model.Team;

@Repository
public interface TeamRepository extends JpaRepository<Team, String> {
	public Team findByName(String name);
}
