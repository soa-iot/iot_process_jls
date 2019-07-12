package cn.soa.service.inter;

import java.util.List;

import cn.soa.entity.activity.HistoryAct;
import cn.soa.entity.activity.HistoryTask;

public interface AcitivityHistoryActSI {

	/**   
	 * @Title: findAllHisActsBypiid   
	 * @Description: 根据任务piid,查询当前流程实例的所有节点（包括完成和未完成）     
	 * @return: List<HistoryTask>        
	 */  
	List<HistoryAct> findAllHisActsBypiid(String piid);

}
