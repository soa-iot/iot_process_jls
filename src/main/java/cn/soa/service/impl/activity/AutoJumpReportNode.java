package cn.soa.service.impl.activity;

import java.util.HashMap;

import org.activiti.engine.TaskService;
import org.activiti.engine.task.Comment;
import org.activiti.engine.task.Task;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cn.soa.controller.ProcessC;
import cn.soa.entity.ProblemInfo;
import cn.soa.service.inter.activiti.ProcessStartHandler;

@Service
public class AutoJumpReportNode implements ProcessStartHandler {
	private static Logger logger = LoggerFactory.getLogger( AutoJumpReportNode.class );
	
	@Autowired
	private TaskService taskService;

	@Override
	public boolean before() {
		// TODO Auto-generated method stub
		return false;
	}

	/**   
	 * <p>Title: after</p>   
	 * <p>Description: </p>  流程执行后 
	 * @param piid
	 * @return   
	 * @see cn.soa.service.inter.activiti.ProcessStartHandler#after(java.lang.String)   
	 */ 
	@Override
	public boolean after( String piid, ProblemInfo problemInfo ) {
		if( StringUtils.isBlank(piid) ) {
			logger.debug("---------piid为null或空-----------");
			return false;
		}
		
		Task task = taskService.createTaskQuery().processInstanceId(piid).singleResult();							
		if( task != null ) {
			//问题上报描述存入节点备注信息
			String comment = problemInfo.getProblemdescribe();
			String tsid = task.getId();
			if( StringUtils.isBlank( tsid )  ) {
				logger.debug("---------tsid为null或空------------" );
			}
			logger.debug("---------tsid-----------" + tsid );
			if( StringUtils.isBlank(comment) ) {
				logger.debug("---------comment为null或空-----------");
			}else {
				try {
					Comment addComment = taskService.addComment( tsid, piid, comment );
					logger.debug("---------问题上报增加备注信息成功：-----------" + addComment );
				} catch (Exception e) {
					e.printStackTrace();
					logger.debug("---------问题上报增加备注信息失败-----------");
				}				
			}
			//增加流程变量-属地单位
			Object var = taskService.getVariable( tsid , "area");
			if( var == null ) {
				logger.debug("---------属地单位为null-----------"); 
				return false;
			}else {				
				HashMap<String, Object> areaVar = new HashMap<String,Object>();
				areaVar.put( "area", areaVar);
				taskService.complete( task.getId(), areaVar, true);
			}	
			
			return true;
		}
		logger.debug("---------task为null-----------");
		return false;
	}

}
