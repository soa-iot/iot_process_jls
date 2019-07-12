package cn.soa.service.impl;

import java.util.List;
import org.activiti.engine.TaskService;
import org.activiti.engine.task.IdentityLink;
import org.activiti.engine.task.Task;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cn.soa.dao.activity.IdentityLinkMapper;
import cn.soa.service.inter.AcitivityTaskSI;

@Service
public class AcitivityTaskS implements AcitivityTaskSI{
	private static Logger logger = LoggerFactory.getLogger( AcitivityTaskS.class );
	
	@Autowired
	private TaskService taskService;
	
	/**   
	 * @Title: getGroupTaskCandidateByTsid   
	 * @Description: 根据任务tsid，获取当前任务的候选人 - 组任务
	 * @return: List<IdentityLink>        
	 */  
	@Override
	public List<IdentityLink> getGroupTaskCandidateByTsid( String tsid ){
		logger.info( "--S--------根据任务tsid，获取当前组任务的候选人---------------");
		try {
			List<IdentityLink> candidates = taskService.getIdentityLinksForTask( tsid );
			if( candidates != null ) {
				logger.info( "--S----------当前任务的候选人-------------" + candidates.toString() );
			}
			return candidates;
		} catch (Exception e) {
			logger.info( "--S----------当前任务的候选人报错-------------" );
			e.printStackTrace();
			return null;
		}
	}
	
	/**   
	 * @Title: getTaskAssigneeByTsid   
	 * @Description: 根据任务tsid，获取当前个人任务的执行人 - 个人任务
	 * @return: Task        
	 */
	@Override
	public Task getTaskAssigneeByTsid( String tsid ){
		logger.info( "--S--------根据任务tsid，获取当前个人任务的执行人---------------");
		try {			
			Task task = taskService.createTaskQuery().taskId(tsid).singleResult();
			if( task != null ) {
				logger.info( "--S----------当前个人任务的执行人-------------" + task.getAssignee() );
			}
			return task;
		} catch (Exception e) {
			logger.info( "--S----------当前个人任务的执行人报错-------------" );
			e.printStackTrace();
			return null;
		}
	}
	
	/**   
	 * @Title: getTaskByTsid   
	 * @Description:  根据任务tsid，获取当前任务  
	 * @return: Task        
	 */  
	@Override
	public Task getTaskByTsid( String tsid ){
		logger.info( "--S--------根据任务tsid，获取当前任务---------------");
		try {			
			Task task = taskService.createTaskQuery().taskId(tsid).singleResult();
			if( task != null ) {
				logger.info( "--S----------当前个人任务-------------" + task );
			}
			return task;
		} catch (Exception e) {
			logger.info( "--S----------获取当前个人任务报错-------------" );
			e.printStackTrace();
			return null;
		}	

	}

	@Override
	public String getActiveTsidByPiid(String piid) {
		// TODO Auto-generated method stub
		return null;
	}

}
