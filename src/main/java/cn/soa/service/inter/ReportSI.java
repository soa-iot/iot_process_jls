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
	 * @Title: addOne   
	 * @Description: 添加一条问题报告数据
	 * @return: ProblemInfoVO   问题报告数据  
	 */
	public ProblemInfoVO getByResavepeople(String resavepeople);
	
	/**   
	 * @Title: verifyApplyPeople   
	 * @Description: 校验问题上报申请人
	 * @return: String  验证结果
	 */
	public String verifyApplyPeople(String[] userList);
	
}
