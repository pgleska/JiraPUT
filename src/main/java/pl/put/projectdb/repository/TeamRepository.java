package pl.put.projectdb.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import pl.put.projectdb.model.Team;

@Repository
@Transactional(readOnly = true)
public interface TeamRepository extends JpaRepository<Team, String> {
	public Team findByName(String name);
}
