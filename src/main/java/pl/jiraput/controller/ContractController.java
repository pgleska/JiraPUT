package pl.jiraput.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import pl.jiraput.model.Company;
import pl.jiraput.model.Contract;
import pl.jiraput.model.Project;
import pl.jiraput.repository.CompanyRepository;
import pl.jiraput.repository.ContractRepository;
import pl.jiraput.repository.ProjectRepository;

@RestController
@RequestMapping("/api/contract")
public class ContractController {

	private final ContractRepository contractRepository;
	private final CompanyRepository companyRepository;
	private final ProjectRepository projectRepository;
	
	public ContractController(ContractRepository contractRepository, CompanyRepository companyRepository, ProjectRepository projectRepository) {
		this.contractRepository = contractRepository;
		this.companyRepository = companyRepository;
		this.projectRepository = projectRepository;
	}
	
	@PostMapping(value = "/create", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody ResponseEntity<Map<String, String>> createContract(@RequestBody Map<String, Object> data) {
		Map<String, String> body = new HashMap<>();
		Contract contract;
		Company company = companyRepository.findByName(data.get("companyName").toString());
		if(company == null) {
			body.put("error", "company.not.found");
			return new ResponseEntity<>(body, HttpStatus.CONFLICT);
		}
		
		Project project = projectRepository.findByName(data.get("projectName").toString());
		if(project == null) {
			body.put("error", "project.not.found");
			return new ResponseEntity<>(body, HttpStatus.CONFLICT);
		}
		
		float amount = 0.0f;
		Object tmp = data.get("amount");
		if(tmp instanceof Integer) {
			amount = ((Integer) tmp).floatValue();
		} else {
			amount = ((Double) tmp).floatValue();
		}
		
		if(data.containsKey("conditions")) {
			contract = new Contract(data.get("contractNumber").toString(), amount, data.get("conditions").toString(), company, project);
		} else {
			contract = new Contract(data.get("contractNumber").toString(), amount, company, project);
		}
		
		if(contractRepository.findByContractNumber(contract.getContractNumber()) == null) {
	    	contractRepository.save(contract);
	    	body.put("status", "contract.created");
	    	return new ResponseEntity<>(body, HttpStatus.OK);
		} else {
			body.put("error", "contract.duplicated");
			return new ResponseEntity<>(body, HttpStatus.CONFLICT);
		}
	}
	
	@GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseStatus(value = HttpStatus.OK)
	public @ResponseBody List<Map<String, Object>> getAllContracts() {
		return contractRepository.findAll().parallelStream().map(c -> {
			Map<String, Object> res = new HashMap<>();
			res.put("id", c.getId());
			res.put("contractNumber", c.getContractNumber());
			res.put("amount", c.getAmount());
			res.put("conditions", c.getConditions());
			res.put("companyName", c.getCompany().getName());
			res.put("taxNumber", c.getCompany().getTaxNumber());
			res.put("projectName", c.getProject().getName());
			res.put("projectId", c.getProject().getId());
			return res;
		}).collect(Collectors.toList());
		//TODO: czy to nie jest bezsensu, w przypadku tysięcy dokumentów będziemy wyświetlać część a nie naraz wszystkie
	}
	
	//TODO: kontrakt nie powinien być edytowalny
		
	@DeleteMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody ResponseEntity<Map<String, String>> deleteContract(@PathVariable Integer id) {
		Map<String, String> body = new HashMap<>();
		Contract contract = contractRepository.findById(id).orElse(null);
		if(contract == null) {
			body.put("error", "contract.not.found");
			return new ResponseEntity<Map<String,String>>(body, HttpStatus.NOT_FOUND);
		}
		
		contractRepository.delete(contract);
		body.put("status", "contract.deleted");
		return new ResponseEntity<Map<String,String>>(body, HttpStatus.OK);	
	}
}
