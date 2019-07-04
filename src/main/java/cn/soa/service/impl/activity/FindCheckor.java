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
		logger.info( "---------确定作业验收的执行人-----------" );
		
		try {
			String piid = execution.getProcessInstanceId();
			
			logger.info( "---------piid-----------" + piid );
			ActivitySI activityS = SpringUtils.getObject(ActivitySI.class);
			List<HistoricTaskInstance> hisTasks = activityS.getHisTaskNodesByPiid(piid);
			
			//初始化
			nodesName.add( "问题评估" );
			nodesName.add( "净化分配" );
			nodesName.add( "维修分配" );
			
			if( hisTasks != null && hisTasks.size() > 0 ) {
				String executor = "";
				for( int i = hisTasks.size() -1 ; i >= 0; i-- ) {
					HistoricTaskInstance t = hisTasks.get(i);
					if( t != null && t.getName() != null && nodesName.contains( t.getName().toString().trim() ) ) {
						executor = "";
						String currentNodeName = t.getName().trim();
						switch ( currentNodeName ) {
							case "问题评估":
								executor = (String) execution.getVariable( "estimators" );
								break;
							case "净化分配":
								executor = (String) execution.getVariable( "puror" );
								break;
							case "维修分配":
								executor = (String) execution.getVariable( "repairor" );
								break;
						}
						
						logger.info( "---------executor-----------" + executor );
						if( StringUtils.isNotBlank(executor) ) {
							execution.setVariable( "checkor", executor);
							logger.info( "---------确定作业验收的执行人成功-----------" );
							break;
						}					
					}				
				}
				if( StringUtils.isBlank( executor) ) {
					logger.info( "---------确定作业验收的执行人失败-----------" );
				}
			}else {
				logger.info( "---------确定作业验收的执行人失败-----------" );
			}					
		} catch (Exception e) {
			e.printStackTrace();
			logger.info( "---------确定作业验收的执行人失败-----------" );
		}
		
	}

}
