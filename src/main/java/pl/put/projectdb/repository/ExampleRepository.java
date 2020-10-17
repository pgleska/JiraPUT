package pl.put.projectdb.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import pl.put.projectdb.model.Example;

@Repository
@Transactional(readOnly = true)
public interface ExampleRepository extends JpaRepository<Example, Integer>  {
	public Example findByIdAndActive(Integer id, Boolean active);
	public List<Example> findByActive(Boolean active);
}
