package pl.jiraput.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import pl.jiraput.model.Example;
import pl.jiraput.repository.ExampleRepository;

@Controller
public class ExampleController {

	private ExampleRepository exampleRepository;

	@Autowired
	ExampleController(ExampleRepository exampleRepository){
		this.exampleRepository = exampleRepository;
	}
	
	@GetMapping("/hello")
	public String getHello() {
		return "hello";
	}
	
	@GetMapping("/examples")
	public @ResponseBody List<Example> getExamples() {
		return exampleRepository.findAll();
	}
	
	@GetMapping("/active")
	public @ResponseBody List<Example> getActiveExamples() {
		return exampleRepository.findByActive(true);
	}
}