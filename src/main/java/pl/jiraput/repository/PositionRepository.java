package pl.jiraput.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import pl.jiraput.model.Position;

@Repository
@Transactional(readOnly = true)
public interface PositionRepository extends JpaRepository<Position, String> {
	Position findByName(String name);
}
