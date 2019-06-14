package cn.soa.service.impl.activity;

import java.util.ArrayList;
import java.util.List;

import org.activiti.engine.delegate.DelegateExecution;
import org.activiti.engine.delegate.ExecutionListener;
import org.activiti.engine.history.HistoricTaskInstance;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import cn.soa.service.inter.ActivitySI;
import cn.soa.service.inter.ProblemInfoSI;
import cn.soa.utils.SpringUtils;

/**
 * @ClassName: FindCheckor
 * @Description: 确定作业验收的执行人
 * @author zhugang
 * @date 2019年6月14日
 */
public class FindCheckor  implements ExecutionListener{
	private static Logger logger = LoggerFactory.getLogger( FindCheckor.class );

	private List<String> nodesName = new ArrayList<String>();
	
	@Override
	public void notify(DelegateExecution execution) throws Exception {
		logger.debug( "---------确定作业验收的执行人-----------" );
		
		try {
			String piid = execution.getProcessInstanceId();
			
			logger.debug( "---------piid-----------" + piid );
			ActivitySI activityS = SpringUtils.getObject(ActivitySI.class);
			List<HistoricTaskInstance> hisTasks = activityS.getHisTaskNodesByPiid(piid);
			logger.debug( "---------hisTasks-----------" + hisTasks.toString() );
			
			//初始化
			nodesName.add( "问题评估" );
			nodesName.add( "净化分配" );
			nodesName.add( "维修分配" );
			
			for( int i = hisTasks.size() -1 ; i >= 0; i-- ) {
				HistoricTaskInstance t = hisTasks.get(i);
				if( t != null && t.getName() != null && nodesName.contains( t.getName().toString().trim() ) ) {
					String executor = t.getAssignee();
					logger.debug( "---------executor-----------" + executor );
					if( StringUtils.isNotBlank(executor) ) {
						execution.setVariable( "checkor", executor);
						logger.debug( "---------确定作业验收的执行人成功-----------" );
						break;
					}else {
						logger.debug( "---------确定作业验收的执行人失败-----------" );
						break;
					}					
				}				
			}			
		} catch (Exception e) {
			e.printStackTrace();
			logger.debug( "---------确定作业验收的执行人失败-----------" );
		}
		
	}

}
