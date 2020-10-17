package pl.put.projectdb.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import pl.put.projectdb.model.Example;
import pl.put.projectdb.repository.ExampleRepository;

@Controller
public class ExampleController {
	
	@Autowired
	private ExampleRepository exampleRepository;
	
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