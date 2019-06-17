package cn.soa.service.inter;

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
	
}
