package cn.soa.service.impl.activity;

import java.util.ArrayList;
import java.util.List;

import org.activiti.engine.delegate.DelegateExecution;
import org.activiti.engine.delegate.DelegateTask;
import org.activiti.engine.delegate.ExecutionListener;
import org.activiti.engine.delegate.TaskListener;
import org.activiti.engine.task.IdentityLink;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import cn.soa.entity.ProblemInfo;
import cn.soa.service.impl.AcitivityTaskS;
import cn.soa.service.impl.ActivityS;
import cn.soa.service.inter.ProblemInfoSI;
import cn.soa.utils.SpringUtils;

/**
 * 
 * @author Bru.Lo
 *
 */
@Service
public class SetProblemRemarktwo implements ExecutionListener {
	
	private static final long serialVersionUID = 1L;
	
	private static Logger logger = LoggerFactory.getLogger( SetProblemRemarktwo.class );

	/**
	 * 将责任人写入数据库
	 */

	@Override
	public void notify(DelegateExecution execution) {

		
		logger.info( "---------后置任务获取任务---------" );	
		ProblemInfoSI problemInfoS= SpringUtils.getObject(ProblemInfoSI.class);
		
		AcitivityTaskS acitivityTaskS = SpringUtils.getObject(AcitivityTaskS.class);
		
		ActivityS activityS = SpringUtils.getObject(ActivityS.class);
		
		String piid = execution.getProcessInstanceId();
		logger.info( "---------获取流程piid："+piid );	
		
		String tsid = activityS.getActiveTsidByPiid(piid);
		logger.info( "---------获取流程tsid："+tsid );	
		
		//获取任务名
		String name = acitivityTaskS.getTaskByTsid(tsid).getName();
		logger.info( "---------获取流程任务名："+name );	
		
		if( piid == null ) {
			logger.info( "---------获取流程piid为空或null------------" );			
		}else {
			
			logger.info( "---------下一个节点名称后置任务更新行数------------2");
			
			/*
			 * ProblemInfo problemInfo = new ProblemInfo(); problemInfo.setPiid(piid);
			 * problemInfo.setRemarktwo(name); Integer row =
			 * problemInfoS.changeProblemDescribeByPiid(problemInfo);
			 * 
			 * logger.info( "---------下一个节点名称后置任务更新行数------------" + row );
			 */
			
		}	
	
		
	}
	
}
