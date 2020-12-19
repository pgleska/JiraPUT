package pl.jiraput.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import pl.jiraput.model.Position;

@Repository
public interface PositionRepository extends JpaRepository<Position, String> {
	Position findByName(String name);
}
