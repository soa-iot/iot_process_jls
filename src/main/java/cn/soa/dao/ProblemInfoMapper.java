package cn.soa.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import cn.soa.entity.ProblemInfo;
import cn.soa.entity.ProblemInfoVO;
import cn.soa.entity.UserOrganization;

/**
 * 问题评估持久层接口
 * @author Bro.Lo
 *
 */
@Mapper
public interface ProblemInfoMapper {
	/**
	 * lixuefeng 新增问题统计功能
	 * 根据流程标识字段查询问题评估信息
	 * @param  时间参数
	 * @return 问题评估信息实体
	 */
	List<Map<String ,Object>> statisticalTaskProblempro(@Param("beginTime")String beginTime,@Param("endTime")String endTime);
	/**
	 * lixuefeng 新增问题查询功能
	 * 根据流程标识字段查询问题评估信息
	 * @param pageSize 
	 * @param  时间参数
	 * @return 问题评估信息实体
	 */
	List<ProblemInfo> queryProblempro(@Param("record")ProblemInfo problemInfo,@Param("page")Integer page,Integer pageSize, @Param("startTime")String startTime,@Param("endTime")String endTime);
	int count(@Param("record")ProblemInfo problemInfo,@Param("startTime")String startTime,@Param("endTime")String endTime);
	
	/**
	 * 
	 * 分页查找问题上报信息
	 * @param problemInfo - 查询条件 
	 * @param page - 第几页
	 * @param limit - 每页条数
	 * @param startTime - 开始时间
	 * @param endTime - 结束时间
	 * @return 问题上报信息列表
	 */
	List<ProblemInfo> findPorblemInfoByPage(
			@Param("record") ProblemInfo problemInfo,
			@Param("page") Integer page,
			@Param("limit") Integer limit, 
			@Param("startTime") String startTime,
			@Param("endTime") String endTime);

	Map<String, Object> PorblemCount(
			@Param("record") ProblemInfo problemInfo,
			@Param("startTime") String startTime,
			@Param("endTime") String endTime);
	
	/**
	 * 
	 * 查找出满足条件的问题上报信息
	 * @param problemInfo - 查询条件 
	 * @param startTime - 开始时间
	 * @param endTime - 结束时间
	 * @return 问题上报信息列表
	 */
	List<ProblemInfo> findPorblemInfo(
			@Param("record") ProblemInfo problemInfo,
			@Param("startTime") String startTime,
			@Param("endTime") String endTime);
	
	/**
	 * 根据流程标识字段查询问题评估信息
	 * @param piid 流程标识字段
	 * @return 问题评估信息实体
	 */
	ProblemInfo findByPiid(String piid);
	
	/**
	 * 根据流程标识字段更新问题问题描述字段
	 * @param piid 流程标识字段
	 * @return 数据库更新数量
	 */
	Integer updateProblemDescribeByPiid(ProblemInfo problemInfo);

	/**   
	 * @Title: findByResavepeopleOrPiid   
	 * @Description: 根据当前登录人或piid查找问题报告  
	 * @return: ProblemInfoVO 问题报告和问题图片对象    
	 */ 
	public ProblemInfoVO findByResavepeopleOrPiid(
			@Param("resavepeople") String resavepeople, 
			@Param("piid") String piid);
	
	/**   
	 * @Title: findByRepId
	 * @Description: 根据问题报告主键id查找暂存状态的问题报告  
	 * @return: ProblemInfo 暂存状态的问题报告对象       
	 */ 
	public ProblemInfo findByRepId(String RepId);
	
	/**   
	 * @Title: findMaxProblemNum
	 * @Description: 获取最大问题编号
	 * @return: Integer 问题编号
	 */ 
	public Integer findMaxProblemNum();
	
	
	/**   
	 * @Title: insertOne   
	 * @Description: 添加一条问题报告数据 
	 * @return: Integer  受影响行数
	 */ 
	public Integer insertOne(ProblemInfo info);
	/**   
	 * @Title: updateOne   
	 * @Description: 更新一条问题报告数据 
	 * @return: Integer  受影响行数      
	 */ 
	public Integer updateOne(ProblemInfo info);
	/**   
	 * @Title: updateEstiByPiid   
	 * @Description: 更新一条问题评估
	 * @return: Integer  受影响行数      
	 */ 
	public Integer updateEstiByPiid(ProblemInfo info);
	
	/**   
	 * @Title: findApplyPeople   
	 * @Description: 根据用户名查找上报申请用户
	 * @return: String  用户的PARENT_ID    
	 */ 
	public String findApplyPeople(String name);
	/**
	 * 根据属地名称去找另外的属地
	 * @param problemtype
	 * @return
	 */
	public List<UserOrganization> findDeptByProblemtype(String problemtype);
	
	/**   
	 * @Title: deleteByPiid   
	 * @Description: 根据piid删除问题上报记录  
	 * @return: int        
	 */  
	public int deleteByPiid( @Param("piid") String piid ); 
	
	/**   
	 * @Title: deleteByPiid   
	 * @Description: 根据bsid删除问题上报记录  
	 * @return: int        
	 */  
	public int deleteByBsid( @Param("bsid") String bsid ); 
	
	/**   
	 * @Title: updatePiidByBsid   
	 * @Description: 根据bsid，更新业务表数据的piid   
	 * @return: int        
	 */  
	public int updatePiidByBsid( @Param("bsid") String bsid, @Param("piid") String piid );

}
