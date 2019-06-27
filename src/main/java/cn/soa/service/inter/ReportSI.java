package cn.soa.service.inter;

import java.util.List;
import java.util.Map;

import cn.soa.entity.ProblemInfo;
import cn.soa.entity.ProblemInfoVO;

public interface ReportSI {
	
	/**   
	 * @Title: addOne   
	 * @Description: 添加一条问题报告数据
	 * @return: String   生成的主键id   
	 */
	public String addOne(ProblemInfo problemInfo, String[] imgList);
	
	/**   
	 * @Title: getByResavepeopleOrPiid   
	 * @Description: 根据当前登录用户或piid查找问题报告数据
	 * @return: ProblemInfoVO  查到的问题报告数据 
	 */
	public ProblemInfoVO getByResavepeopleOrPiid(String resavepeople, String piid);
	
	/**   
	 * @Title: verifyApplyPeople   
	 * @Description: 校验问题上报申请人
	 * @return: String  验证结果
	 */
	public String verifyApplyPeople(String[] userList);
	
	/**   
	 * @Title: getProblemInfoByPage   
	 * @Description: 根据条件分页查询出问题上报信息列表
	 * @return: ProblemInfo  查到的问题报告数据列表 
	 */
	public List<ProblemInfo> getProblemInfoByPage(ProblemInfo problemInfo, Integer page,
			Integer limit, String startTime, String endTime);
	
	/**   
	 * @Title: ProblemCount   
	 * @Description: 根据条件查询出问题上报信息的条数
	 * @return: Integer   查询数据的条数
	 */
	public Map<String, Object> ProblemCount(ProblemInfo problemInfo, String startTime, String endTime);
	
	/**   
	 * @Title: getProblemInfo   
	 * @Description: 根据条件查询出问题上报信息列表
	 * @return: ProblemInfo  查到的问题报告数据列表 
	 */
	public List<ProblemInfo> getProblemInfo(ProblemInfo problemInfo, String startTime, String endTime);
}
