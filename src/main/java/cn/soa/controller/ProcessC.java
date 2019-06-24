package cn.soa.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.transaction.Transactional;
import javax.validation.constraints.NotBlank;

import org.activiti.engine.repository.Deployment;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cn.soa.entity.ProblemInfo;

import cn.soa.entity.ResultJson;
import cn.soa.entity.ResultJsonForTable;
import cn.soa.entity.TodoTask;
import cn.soa.service.inter.ActivitySI;
import cn.soa.service.inter.BussinessSI;
import cn.soa.service.inter.ConfigSI;
import cn.soa.service.inter.ProblemInfoSI;
import cn.soa.service.inter.ProcessVariableSI;
import cn.soa.service.inter.activiti.ProcessStartHandler;

/**
 * @ClassName: ProcessC
 * @Description: 流程控制 - 控制层
 * @author zhugang
 * @date 2019年5月29日
 */
@RestController
@RequestMapping("/process")
public class ProcessC {
	private static Logger logger = LoggerFactory.getLogger( ProcessC.class );
	
	@Autowired
	private ActivitySI activityS;
	
	@Autowired
	private ConfigSI configS;
	
	@Autowired
	private BussinessSI bussinessS;
	
	@Autowired
	private ProcessVariableSI processVariableS;
	
	@Autowired
	private ProcessStartHandler processStartHandler;
		
	@Autowired
	private ProblemInfoSI problemInfoS;
		
	/**   
	 * @Title: startProcessC   
	 * @Description:  部署流程
	 * @return: void        
	 */ 
	@PostMapping("/deployment")
	public ResultJson<Boolean> deployProcessC1( 
			@RequestParam("name") String name,
			@RequestParam("xmlUrl") @NotBlank String xmlUrl,
			@RequestParam("pngUrl") @NotBlank String pngUrl ) {
		logger.debug( "--C----------部署流程---------------" );
		logger.debug( name );
		logger.debug( xmlUrl );
		logger.debug( pngUrl );
		if( name !=null ) {			
			Deployment deployment = activityS.deployProcess( name, xmlUrl, pngUrl );			
			if( deployment != null ) {
				logger.debug( deployment.toString() );
				return new ResultJson<Boolean>( 0, "部署成功", true );
			}else {
				return new ResultJson<Boolean>( 1, "部署失败", false );
			}
		}else {
			Deployment deployment = activityS.deployProcessNoName( xmlUrl, pngUrl );
			if( deployment != null ) {
				return new ResultJson<Boolean>( 0, "部署成功", true );
			}else {
				return new ResultJson<Boolean>( 1, "部署失败", false );
			}
		}				
	}
	
	/**   
	 * @Title: startProcessC   
	 * @Description:  部署流程（get方式,测试专用）
	 * @return: void        
	 */ 
	@GetMapping("/deployment")
	public ResultJson<Boolean> deployProcessC2( 
			@RequestParam("name") String name,
			@RequestParam("xmlUrl") @NotBlank String xmlUrl,
			@RequestParam("pngUrl") @NotBlank String pngUrl ) {
		logger.debug( "--C----------部署流程---------------" );
		logger.debug( name );
		logger.debug( xmlUrl );
		logger.debug( pngUrl );
		if( name !=null ) {			
			Deployment deployment = activityS.deployProcess( name, xmlUrl, pngUrl );
			if( deployment != null ) {
				return new ResultJson<Boolean>( 0, "部署成功", true );
			}else {
				return new ResultJson<Boolean>( 1, "部署失败", false );
			}
		}else {
			Deployment deployment = activityS.deployProcessNoName( xmlUrl, pngUrl );
			if( deployment != null ) {
				return new ResultJson<Boolean>( 0, "部署成功", true );
			}else {
				return new ResultJson<Boolean>( 1, "部署失败", false );
			}
		}				
	}
	
	/**   
	 * @Title: getProcessConfigFile   
	 * @Description: 获取activity流程配置文件格式为bpmn的全部文件（已指定目录/process）  
	 * @return: ResultJson<List<Map<String,Object>>>        
	 */  
	@GetMapping("/configfiles")
	public ResultJson<List<Map<String,Object>>> getConfigFileBPMN() {
		logger.debug( "--C----------获取activity流程配置文件格式为bpmn的全部文件（已指定目录/process）---------------" );
		List<Map<String, Object>> files = activityS.getconfigFileBPMN();
		if( files != null ) {
			return new ResultJson<List<Map<String,Object>>>( 0, "获取文件成功", files );
		}
		return new ResultJson<List<Map<String,Object>>>( 1, "获取文件失败", files );
	}
	
	/**   
	 * @Title: startProcess   
	 * @Description: 启动流程（同时业务处理）  
	 * @return: ResultJson<String>        
	 */ 
	@PostMapping("/{dfid}")
	public ResultJson<String> startProcess(
			@PathVariable("dfid") @NotBlank String dfid,
			ProblemInfo problemInfo ){
		logger.debug( "--C--------启动流程（同时业务处理）  -------------" );
		logger.debug( dfid );
		logger.debug( problemInfo.toString() );
				
		/*
		 * 执行业务处理（具体业务处理需要实现以下接口）
		 */
		String bsid = bussinessS.dealProblemReport( problemInfo );
		if( bsid == null ) {
			return new ResultJson<String>( 1, "业务处理失败，流程未启动", "业务处理失败，流程未启动" );
		}
		logger.debug( "--C--------bsid  -------------" + bsid);
		
		try {
			/*
			 * 处理数据库配置流程变量
			 */
			Map<String, Object> basicVars = configS.setVarsAtStart();
			logger.debug( "--C--------basicVars  -------------" + basicVars);
			
			/*
			 * 处理临时流程变量
			 */
			Map<String, Object> tempVars = processVariableS.addVarsStartProcess( problemInfo );
			logger.debug( "--C--------tempVars  -------------" + tempVars);
					
			/*
			 * 流程启动
			 */
			Map<String, Object> vars = new HashMap<String, Object>();
			vars.putAll(basicVars);
			vars.putAll(tempVars);
			logger.debug( "--C--------vars  -------------" + vars);
			
			/*
			 * 流程启动前的流程其他业务处理
			 */
			boolean beforeHandler = processStartHandler.before( bsid, problemInfo);
			if( beforeHandler ) logger.debug( "--C--------流程启动前的流程其他业务处理  -------------" + beforeHandler);
			
			//流程启动
			String piid = activityS.startProcess( dfid, bsid, vars );
			logger.debug( "--C--------piid  -------------" + piid);
			
			/*
			 * 流程启动后的流程其他业务处理 - 修改为观察者模式
			 */
			boolean afterHandler =processStartHandler.after( bsid, piid, problemInfo );
			if( beforeHandler ) logger.debug( "--C--------流程启动后的流程其他业务处理  -------------" + beforeHandler);
			
			return new ResultJson<String>( 0, "流程启动成功", piid + "," + bsid);
		} catch (Exception e) {
			e.printStackTrace();
			try {
				int i = problemInfoS.deleteByBsid( bsid );
				logger.debug( "--C--------流程启动失败后，删除新增的业务记录成功  -------------" + bsid);
			} catch (Exception e2) {
				e.printStackTrace();		
				logger.debug( "--C--------流程启动失败后，删除新增的业务记录失败  -------------" + bsid);
			}			
			return new ResultJson<String>( 1, "流程启动失败", null);
		}		
	}
	
	/**   
	 * @Title: nextNode   
	 * @Description: 执行流程的下一步（流程实例piid）   - 需要传递执行当前任务的人（变量userName）
	 * @return: ResultJson<String>        
	 */ 
	@PutMapping("/nodes/next/group/piid/{piid}")
	public ResultJson<Boolean> nextGroupNodeByPIID( 
			@PathVariable("piid") String piid,
			@RequestParam Map<String,Object> map){
		logger.debug( "--C-------- 执行流程的下一步     -------------" );
		logger.debug( piid );
		logger.debug( map.toString() );
				
		boolean b = activityS.nextNodeByPIID( piid, map );
		if( b ) {
			return new ResultJson<Boolean>( 0, "流程流转下一个节点任务成功", true );
		}
		return new ResultJson<Boolean>( 1, "流程流转下一个节点任务失败", false );
	}
	
	/**   
	 * @Title: nextNode   
	 * @Description: 执行流程的下一步（流程实例piid）   - 需要传递执行当前任务的人（变量userName）
	 * @return: ResultJson<String>        
	 */ 
	@PutMapping("/nodes/next/piid/{piid}")
	public ResultJson<Boolean> nextNodeByPIID( 
			@PathVariable("piid") String piid,
			@RequestParam Map<String,Object> map){
		logger.debug( "--C-------- 执行流程的下一步     -------------" );
		logger.debug( piid );
		logger.debug( map.toString() );
				
		boolean b = activityS.nextNodeByPIID1( piid, map );
		if( b ) {
			return new ResultJson<Boolean>( 0, "流程流转下一个节点任务成功", true );
		}
		return new ResultJson<Boolean>( 1, "流程流转下一个节点任务失败", false );
	}
	
	/**   
	 * @Title: nextNode   
	 * @Description: 执行流程的下一步（任务tsid）   
	 * @return: ResultJson<String>        
	 */ 
	@PutMapping("/nodes/next/tsid/{tsid}")
	public ResultJson<Boolean> nextNodeByTSID( 
			@PathVariable("tsid") String tsid,
			@RequestParam(value="var",required=false) String var,
			@RequestParam(value="varValue",required=false) String varValue,
			@RequestParam("comment") String comment,
			@RequestParam("nodeid") String nodeid){
		logger.debug( "--C-------- 执行流程的下一步     -------------" );
		logger.debug( tsid );
		logger.debug( var );
		logger.debug( comment );
		logger.debug( varValue );
		Boolean b = activityS.nextNodeByTSID(tsid, var, varValue, comment);
		if( b ) {
			return new ResultJson<Boolean>( 0, "流程流转下一个节点任务成功", true );
		}
		return new ResultJson<Boolean>( 1, "流程流转下一个节点任务失败", false );
	}
	
	/**   
	 * @Title: endProcess   
	 * @Description:  终止流程 (piid) - 组任务
	 * @return: ResultJson<String>        
	 */  
	@PutMapping("/nodes/end/group/piid/{piid}")
	public ResultJson<String> endProcessIngroup(
			@PathVariable("piid") @NotBlank String piid,
			@RequestParam String comment ){
		logger.debug( "--C-------- 终止流程     -------------" );
		logger.debug( piid );
		logger.debug( comment );
		String s = activityS.endProcessByPiidInComment(piid, comment);
		if( StringUtils.isBlank( s ) ) {
			return new ResultJson<String>( 1, "闭环流程失败", "闭环流程失败" );
		}
		return new ResultJson<String>( 0, "闭环流程成功", "闭环流程成功" );
	}
	
	/**   
	 * @Title: endProcess   
	 * @Description:  终止流程 (piid) - 非组任务
	 * @return: ResultJson<String>        
	 */  
	@PutMapping("/nodes/end/piid/{piid}")
	public ResultJson<String> endProcess(
			@PathVariable("piid") @NotBlank String piid,
			@RequestParam String comment ){
		logger.debug( "--C-------- 终止流程     -------------" );
		logger.debug( piid );
		logger.debug( comment );
		String s = activityS.endProcessByPiidInComment(piid, comment);
		if( StringUtils.isBlank( s ) ) {
			return new ResultJson<String>( 1, "闭环流程失败", "闭环流程失败" );
		}
		return new ResultJson<String>( 0, "闭环流程成功", "闭环流程成功" );
	}
	
	/**   
	 * @Title: getHitoryNodeInfos   
	 * @Description:  根据任务tsid，获取流程所有的历史节点 
	 * @return: ResultJson<List<Map<String,Object>>>        
	 */  
	@GetMapping("/nodes/historyAct/tsid/{tsid}")
	public ResultJson<List<Map<String,Object>>> getHisActInfosByTsid(
			@PathVariable("tsid") @NotBlank String tsid ){
		logger.debug( "--C-------- 根据任务tsid，获取流程所有的历史节点      -------------" );
		logger.debug( tsid );
		List<Map<String, Object>> historyNodesInfo = activityS.getHisInfosByTsid( tsid );
		if( historyNodesInfo != null && historyNodesInfo.size() > 0  ) {
			return new ResultJson<List<Map<String,Object>>>( 0, "获取流程所有的历史节点成功", historyNodesInfo );
		}
		return new ResultJson<List<Map<String,Object>>>( 0, "获取流程所有的历史节点失败", null );

	}
	
	/**   
	 * @Title: getHitoryNodeInfos   
	 * @Description:  根据任务tsid，获取流程所有的活动节点 
	 * @return: ResultJson<List<Map<String,Object>>>        
	 */  
	@GetMapping("/nodes/historyAct/piid/{piid}")
	public ResultJson<List<Map<String,Object>>> getHisActInfosByPiid(
			@PathVariable("piid") @NotBlank String piid ){
		logger.debug( "--C-------- 根据任务piid，获取流程所有的历史节点      -------------" );
		logger.debug( piid );
		List<Map<String, Object>> historyNodesInfo = activityS.getHisActNodesByPiid( piid );
		if( historyNodesInfo != null && historyNodesInfo.size() > 0  ) {
			return new ResultJson<List<Map<String,Object>>>( 0, "获取流程所有的历史节点成功", historyNodesInfo );
		}
		return new ResultJson<List<Map<String,Object>>>( 0, "获取流程所有的历史节点失败", null );

	}
	
	/**   
	 * @Title: getHisTaskNodeInfosByPiid   
	 * @Description: 根据流程piid，获取当前流程的任务节点信息  
	 * @return: ResultJson<List<Map<String,Object>>>        
	 */  
	@GetMapping("/nodes/historyTask/piid/{piid}")
	public ResultJson<List<Map<String,Object>>> getHisTaskNodeInfosByPiid(
			@PathVariable("piid") @NotBlank String piid ){
		logger.debug( "--C-------- 根据流程piid，获取当前流程的任务节点信息      -------------" );
		logger.debug( piid );
		List<Map<String, Object>> historyNodesInfo = activityS.getHisTaskNodeInfosByPiid( piid );
		if( historyNodesInfo != null && historyNodesInfo.size() > 0  ) {
			return new ResultJson<List<Map<String,Object>>>( 0, "获取流程实例已完成的任务节点成功", historyNodesInfo );
		}
		return new ResultJson<List<Map<String,Object>>>( 0, "获取流程实例已完成的任务节点失败", null );

	}
	
	/**   
	 * @Title: backToBeforeNodes   
	 * @Description:   根据任务piid，流程返回到上一个节点 - 非组任务
	 * @return: ResultJson<Boolean>        
	 */  
	@PutMapping("/nodes/before/piid/{piid}")
	public ResultJson<Boolean> backToBeforeNodesByPiid(
			@PathVariable("piid") @NotBlank String piid,
			@RequestParam("comment") String comment ){
		logger.debug( "--C-------- 根据任务piid，流程返回到上一个节点     -------------" );
		logger.debug( piid );
		logger.debug( comment );
		boolean b = activityS.backToBeforeNodeByPiid( piid, comment );
		if( b ) {
			return new ResultJson<Boolean>( 0, "流程返回到上一个节点成功", true );
		}
		return new ResultJson<Boolean>( 0, "流程返回到上一个节点失败", null );

	}
	
	
	/**   
	 * @Title: backToBeforeNodes   
	 * @Description:   根据任务piid，流程返回到上一个节点 - 组任务
	 * @return: ResultJson<Boolean>        
	 */  
	@PutMapping("/nodes/before/group/piid/{piid}")
	public ResultJson<Boolean> backToBeforeNodesByPiidInGroup(
			@PathVariable("piid") @NotBlank String piid,
			@RequestParam("comment") String comment ){
		logger.debug( "--C-------- 根据任务piid，流程返回到上一个节点     -------------" );
		logger.debug( piid );
		logger.debug( comment );
		boolean b = activityS.backToBeforeNodeByPiid( piid, comment );
		if( b ) {
			return new ResultJson<Boolean>( 0, "流程返回到上一个节点成功", true );
		}
		return new ResultJson<Boolean>( 0, "流程返回到上一个节点失败", null );
	}

	/**   
	 * @Title: backToBeforeNodes   
	 * @Description:   根据任务piid，流程返回到上一个节点 - 组任务
	 * @return: ResultJson<Boolean>        
	 */  
	@PutMapping("/nodes/before/group/piid/{piid}")
	public ResultJson<Boolean> backToBeforeNodesByPiidInGroup(
			@PathVariable("piid") @NotBlank String piid,
			@RequestParam Map<String,Object> map){
		logger.debug( "--C-------- 根据任务piid，流程返回到上一个节点     -------------" );
		logger.debug( piid );
		if( map != null && map.size() > 0) {
			logger.debug( map.toString() );
		}
		boolean b = activityS.backToBeforeNodeByPiidInGroup( piid, map );
		if( b ) {
			return new ResultJson<Boolean>( 0, "流程返回到上一个节点成功", true );
		}
		return new ResultJson<Boolean>( 0, "流程返回到上一个节点失败", null );
	}

	/**   
	 * @Title: getAllTasksByUsernameC   
	 * @Description:  根据用户姓名，查询用户的所有待办任务（个人任务+组任务）   
	 * @return: ResultJson<Task>        
	 */ 
	@GetMapping("/tasks")
	public ResultJson<List<TodoTask>> getAllTasksByUsernameC(
			@RequestParam("userName") @NotBlank String userName ){
		logger.debug( "--C-------- 根据用户姓名，查询用户的所有待办任务（个人任务+组任务）     -------------" );
		logger.debug( userName );
		List<TodoTask> tasks = activityS.getAllTasksByUsername( userName );
		if( tasks != null ) {
			return new ResultJson<List<TodoTask>>( 0, "流程返回到上一个节点成功", tasks );
		}
		return new ResultJson<List<TodoTask>>( 0, "流程返回到上一个节点失败", tasks );
	}
	
	/**   
	 * @Title: getAllTasksByUsernameC   
	 * @Description:  根据用户姓名，查询用户的所有待办任务（个人任务+组任务） - layui指定格式   
	 * @return: ResultJson<Task>        
	 */ 
	@GetMapping("/tasks/layui")
	public ResultJsonForTable<List<TodoTask>> getAllTasksByUsername1C(
			@RequestParam("userName") @NotBlank String userName ){
		logger.debug( "--C-------- 根据用户姓名，查询用户的所有待办任务（个人任务+组任务）     -------------" );
		logger.debug( userName );
		List<TodoTask> tasks = activityS.getAllTasksByUsername( userName );
		if( tasks != null ) {
			return new ResultJsonForTable<List<TodoTask>>( 0, "代办任务查询成功", tasks.size(), tasks );
		}
		return new ResultJsonForTable<List<TodoTask>>( 0, "代办任务查询失败", 0, tasks );

	}
	
	/**   
	 * @Title: jumpNodesByPiid   
	 * @Description: 流程节点跳转 - 组任务  
	 * @return: ResultJsonForTable<Boolean>        
	 */  
	@PutMapping("/nodes/jump/group/piid/{piid}")
	public ResultJson<Boolean> jumpNodesByPiidInGroup(
			@PathVariable("piid") String piid,
			@RequestParam Map<String,Object> map ){
		logger.debug( "--C-------- 流程节点跳转 - 组任务      -------------" );
		logger.debug( piid );
		if( map != null && map.size() > 0 ) {
			logger.debug( map.toString() );
		}else {
			logger.debug( "-------变量map为null--------" );
		}
		
		boolean b = activityS.transferProcessByPiid(piid, map);
		if( b ) {
			return new ResultJson<Boolean>( 0, "节点跳转成功", true );
		}
		return new ResultJson<Boolean>( 0, "节点跳转失败", false );
	}

}
