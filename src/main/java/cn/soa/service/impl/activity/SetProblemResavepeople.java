package cn.soa.service.impl.activity;

import java.util.ArrayList;
import java.util.List;

import org.activiti.engine.delegate.DelegateExecution;
import org.activiti.engine.delegate.ExecutionListener;
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
 * 责任人后置任务
 * @author Bru.Lo
 *
 */
@Service
public class SetProblemResavepeople implements ExecutionListener{
	
	private static final long serialVersionUID = 1L;
	
	private static Logger logger = LoggerFactory.getLogger( SetProblemResavepeople.class );

	/**
	 * 将责任人写入数据库
	 */
	@Override
	public void notify(DelegateExecution execution) throws Exception {
		
		logger.info( "---------获取责任人后置任务---------" );	
		ProblemInfoSI problemInfoS= SpringUtils.getObject(ProblemInfoSI.class);
		
		AcitivityTaskS acitivityTaskS = SpringUtils.getObject(AcitivityTaskS.class);
		
		ActivityS activityS = SpringUtils.getObject(ActivityS.class);
		
		String piid = execution.getProcessInstanceId();
		logger.info( "---------获取流程piid："+piid );	
		
		String tsid = activityS.getTsidByPiid(piid);
		logger.info( "---------获取流程tsid："+tsid );	
		
		//获取责任人名
		List<IdentityLink> identityLinks = acitivityTaskS.getGroupTaskCandidateByTsid(tsid);
		List<String> candidateNames = new ArrayList<>(); 
		String name= null;
		for (IdentityLink identityLink : identityLinks) {
			if ("candidate".equals(identityLink.getType())) {
				candidateNames.add(identityLink.getUserId());
				logger.info( "---------候选人信息identityLink："+identityLink );	
			}
			
		}
		
		name = StringUtils.join(candidateNames, ",");
		logger.info( "---------候选人名："+name );	
		
		
		if( piid == null ) {
			logger.info( "---------获取流程piid为空或null------------" );			
		}else {
			
			ProblemInfo problemInfo = new ProblemInfo();
			problemInfo.setPiid(piid);
			problemInfo.setMaintenanceman (name);
			Integer row = problemInfoS.changeProblemDescribeByPiid(problemInfo);
			
			logger.info( "---------责任人后置任务更新行数------------" + row );
			
		}	
	}
	
}
