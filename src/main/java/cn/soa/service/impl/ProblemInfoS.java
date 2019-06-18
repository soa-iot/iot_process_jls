package cn.soa.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cn.soa.dao.ProblemInfoMapper;
import cn.soa.entity.ProblemInfo;
import cn.soa.entity.UserOrganization;
import cn.soa.service.inter.ProblemInfoSI;
import javassist.expr.NewArray;

/**
 * 问题评估业务逻辑层实现类
 * 
 * @author Bru.Lo
 *
 */
@Service
public class ProblemInfoS implements ProblemInfoSI {

	@Autowired
	private ProblemInfoMapper problemInfoMapper;
	/**
	 * 根据流程标识字段查询问题评估信息
	 * @param piid 流程标识字段
	 * @return 问题评估信息实体
	 */
	public List<Map<String ,Object>> statisticalTaskProblempro(String beginTime,String endTime){
		
		return problemInfoMapper.statisticalTaskProblempro(beginTime, endTime);
		
		
	};
	/**
	 * 根据流程标识字段查询问题评估信息
	 * 
	 * @param piid 流程标识字段
	 * @return 问题评估信息实体
	 */
	@Override
	public ProblemInfo getByPiid(String piid) {
		return findByPiid(piid);

	}

	/**
	 * 根据流程标识字段更新问题问题描述字段
	 * @param piid 流程标识字段
	 * @return 数据库更新数量
	 */
	@Override
	public Integer changeProblemDescribeByPiid(String piid, String problemdescribe) {
		
		return updateProblemDescribeByPiid(piid, problemdescribe);
	}

	/**   
	 * @Title: ModifyEstiByPiid   
	 * @Description: 更新一条问题评估
	 * @return: Integer  受影响行数      
	 */ 
	public Integer ModifyEstiByPiid(ProblemInfo info) {
		return updateEstiByPiid(info);
	}
	
	
	/**
	 * 持久层方法实现发
	 * 
	 * @param piid 流程标识字段
	 * @return 问题评估信息实体
	 */
	private ProblemInfo findByPiid(String piid) {
		try {
			ProblemInfo problemInfo = problemInfoMapper.findByPiid(piid);
			return problemInfo;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * 持久层方法实现
	 * 
	 * 根据流程标识字段更新问题问题描述字段
	 * @param piid 流程标识字段
	 * @return 数据库更新数量
	 */
	public Integer updateProblemDescribeByPiid(String piid,String problemdescribe) {
		try {
			Integer rows = problemInfoMapper.updateProblemDescribeByPiid(piid, problemdescribe);
			return rows;
		} catch (Exception e) {
			e.printStackTrace();
			return -1;
		}
	}
	
	/**
	 * 根据属地名称去找另外的属地
	 * @param problemtype
	 * @return
	 */
	public List<UserOrganization> getDeptByProblemtype(String problemtype){
		
		List<UserOrganization> list = findDeptByProblemtype(problemtype);
		String parentId = null;
		
		//如果是维修工段，则去掉净化工段和其子节点
		if ("维修工段".equals(problemtype)) {
			for (int i = 0; i < list.size(); i++) {
				if (list.get(i).getName().equals("净化工段")) {
					parentId=list.get(i).getUsernum();
					list.remove(i);
				}
			}
		}
		if (parentId != null) {
			List<UserOrganization> list2 = new ArrayList<>();
			for (int j = 0; j < list.size(); j++) {
				if (list.get(j).getParent_id().equals(parentId)) {
					list2.add(list.get(j));
				}
			}
			System.err.println(list2);
			list.removeAll(list2);
		}
		return list;
	}
	
	/**   
	 * @Title: updateEstiByPiid   
	 * @Description: 更新一条问题评估实现方法
	 * @return: Integer  受影响行数      
	 */ 
	private Integer updateEstiByPiid(ProblemInfo info) {
		
		try {
			Integer row = problemInfoMapper.updateEstiByPiid(info);
			return row;
		} catch (Exception e) {
			e.printStackTrace();
			return -1;
		}
	}
	
	/**
	 * 根据属地名称去找另外的属地
	 * @param problemtype
	 * @return
	 */
	private List<UserOrganization> findDeptByProblemtype(String problemtype){
		try {
			List<UserOrganization> userOrganizations = problemInfoMapper.findDeptByProblemtype(problemtype);
			return userOrganizations;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}	
	}
	
	/**   
	 * @Title: deleteByPiid   
	 * @Description: 根据piid删除问题上报记录 
	 * @return: int        
	 */  
	@Override
	public int deleteByPiid( String piid ) {
		try {
			int i = problemInfoMapper.deleteByPiid(piid);
			return i;
		} catch (Exception e) {
			e.printStackTrace();
			return -1;
		}
	}
	
	/**   
	 * @Title: deleteByPiid   
	 * @Description: 根据tsid删除问题上报记录 
	 * @return: int        
	 */  
	@Override
	public int deleteByBsid( String bsid ) {
		try {
			int i = problemInfoMapper.deleteByBsid( bsid );
			return i;
		} catch (Exception e) {
			e.printStackTrace();
			return -1;
		}
	}
	
	/**   
	 * @Title: updatePiidByBsid   
	 * @Description: 根据bsid，更新业务表数据的piid    
	 * @return: int        
	 */ 
	@Override
	public int updatePiidByBsid( String bsid, String biid ) {
		try {
			int i = problemInfoMapper.updatePiidByBsid( bsid, biid );
			return i;
		} catch (Exception e) {
			e.printStackTrace();
			return -1;
		}
	}
}
