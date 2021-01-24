package pl.jiraput.controller;

import java.math.BigInteger;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import pl.jiraput.model.Company;
import pl.jiraput.model.Contract;
import pl.jiraput.repository.CompanyRepository;

@RestController
@RequestMapping("/api/company")
public class CompanyController {
	
	private final CompanyRepository companyRepository;
	
	public CompanyController(CompanyRepository companyRepository) {
		this.companyRepository = companyRepository;
	}
	
	@PostMapping(value = "/create", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Map<String, String>> createCompany(@RequestBody Company company) {
		Map<String, String> body = new HashMap<>();
		if(companyRepository.findByTaxNumber(company.getTaxNumber()) != null) {
			body.put("error", "company.duplicated");
			return new ResponseEntity<>(body, HttpStatus.CONFLICT);
		} 
		if(companyRepository.findByName(company.getName()) != null) {
			body.put("error", "company.duplicated");
			return new ResponseEntity<>(body, HttpStatus.CONFLICT);
		}
		companyRepository.save(company);
		body.put("status", "company.created");
		return new ResponseEntity<>(body, HttpStatus.CREATED);
	}
	
	@GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseStatus(code = HttpStatus.OK)
	public List<Map<String, Object>> getAllCompanies() {
		return companyRepository.findAll().parallelStream().map(c -> {
			Map<String, Object> res = new HashMap<>();
			res.put("taxNumber", c.getTaxNumber());
			res.put("name", c.getName().toString());
			res.put("address", c.getAddress().toString());			
			res.put("contracts", c.getContracts().parallelStream().map(Contract::getContractNumber).collect(Collectors.toList()));
			return res;
		}).collect(Collectors.toList());
	}

	@PatchMapping(value = "/{taxNumber}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Map<String, String>> editCompany(@PathVariable BigInteger taxNumber, @RequestBody Map<String, String> data) {
		Map<String, String> body = new HashMap<>();
		Company company = companyRepository.findByTaxNumber(taxNumber);
		if(company ==  null) {
			body.put("error", "company.not.found");
			return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
		}
		if(data.containsKey("name")) 
			company.setName(data.get("name"));
		if(data.containsKey("addres")) 
			company.setAddress(data.get("address"));
		companyRepository.save(company);
		body.put("status", "company.updated");
		return new ResponseEntity<Map<String,String>>(body, HttpStatus.OK);
	}
	
	@DeleteMapping(value = "/{taxNumber}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Map<String, String>> deleteCompany(@PathVariable BigInteger taxNumber) {
		Map<String, String> body = new HashMap<>();
		Company company = companyRepository.findByTaxNumber(taxNumber);
		if(company ==  null) {
			body.put("error", "company.not.found");
			return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
		}
		if(!company.getContracts().isEmpty()) {
			body.put("error", "company.not.empty");
			return new ResponseEntity<>(body, HttpStatus.CONFLICT);
		} else {
			companyRepository.delete(company);
			body.put("status", "company.deleted");
			return new ResponseEntity<Map<String,String>>(body, HttpStatus.OK);
		}
	}
}
