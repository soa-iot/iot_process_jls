package cn.soa.service.inter;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import cn.soa.entity.ProblemInfo;
import cn.soa.entity.ProblemTypeArea;
import cn.soa.entity.UserOrganization;

/**
 * 问题评估业务逻辑层接口
 * @author Bru.Lo
 *
 */
@Service
public interface ProblemInfoSI {
	/**
	 * lixuefeng
	 * 问题多个维度查询，具备分页功能
	 */
	List<ProblemInfo> 	queryProblempro(ProblemInfo problemInfo,Integer page,Integer pageSize,String startTime,String endTime);
	/**
	 * 问题统计
	 */
	int	count(ProblemInfo problemInfo,String startTime,String endTime);
	/**
	 * 统计问题整改情况
	 */
	public List<Map<String ,Object>> statisticalTaskProblempro(String beginTime,String endTime);
	/**
	 * 根据流程标识字段查询问题评估信息
	 * @param piid 流程标识字段
	 * @return 问题评估信息实体
	 */
	ProblemInfo getByPiid(String piid);
	
	/**
	 * 根据流程标识字段更新问题问题描述字段
	 * @param piid 流程标识字段
	 * @return 数据库更新数量
	 */
	Integer changeProblemDescribeByPiid(ProblemInfo problemInfo);
	
	/**   
	 * @Title: ModifyEstiByPiid   
	 * @Description: 更新一条问题评估
	 * @return: Integer  受影响行数      
	 */ 
	Integer ModifyEstiByPiid(ProblemInfo info);
	
	/**
	 * 根据属地名称去找另外的属地
	 * @param problemtype
	 * @return
	 */
	public List<UserOrganization> getDeptByProblemtype(String problemtype);
	
	/**   
	 * @Title: deleteByPiid   
	 * @Description: 根据piid删除问题上报记录   
	 * @return: int        
	 */  
	int deleteByPiid(String piid);

	/**   
	 * @Title: deleteByBsid   
	 * @Description: 根据tsid删除问题上报记录   
	 * @return: int        
	 */  
	int deleteByBsid(String tsid);

	/**   
	 * @Title: updatePiidByBsid   
	 * @Description: 根据bsid，更新业务表数据的piid    
	 * @return: int        
	 */  
	int updatePiidByBsid( String bsid, String piid );
	
	/**
	 * 根据用部分problemdescribe查询对应的数据
	 * @param problemdescribele
	 * @return ProblemInfo集合
	 */
	List<ProblemInfo> getAutoFill(String problemdescribe);
	
}
