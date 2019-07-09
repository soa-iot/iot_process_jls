package cn.soa.entity;

import java.io.Serializable;
import java.util.Date;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestParam;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

/**
 * 问题上报查询条件封装类
 * 
 * @author Jiang, Hang
 *
 */
@SuppressWarnings("serial")
@Data
@Accessors(chain = true)
@Validated
public class ProblemInfoQuery extends ProblemInfo {
	
	private Integer page;
	private Integer limit;
	private String startTime;
	private String endTime;
	private String schedule;
	private String handler;
	private String sortField;
	private String sortType;
	
	public ProblemInfoQuery() {
		super();
	}
		
}
