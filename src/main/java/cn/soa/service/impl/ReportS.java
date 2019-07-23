package cn.soa.service.impl;

import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cn.soa.dao.ProblemInfoMapper;
import cn.soa.dao.ProblemReportphoMapper;
import cn.soa.dao.ProblemTypeAreaMapper;
import cn.soa.entity.ProblemInfo;
import cn.soa.entity.ProblemInfoVO;
import cn.soa.entity.ProblemTypeArea;
import cn.soa.service.inter.ReportSI;
import lombok.extern.slf4j.Slf4j;


@Service
@Slf4j
public class ReportS implements ReportSI {
	
	@Autowired
	private ProblemInfoMapper reportMapper;
	@Autowired
	private ProblemReportphoMapper phoMapper;
	@Autowired
	private ProblemTypeAreaMapper problemTypeAreaMapper;
	
	/**   
	 * @Title: addOne   
	 * @Description: 添加/更新一条问题报告数据
	 * @return: String   生成的问题报告主键id   
	 */
	@SuppressWarnings("unchecked")
	@Transactional
	@Override
	public String addOne(ProblemInfo problemInfo, String[] imgList) {
		
		String RepId = problemInfo.getTProblemRepId();
		String piid = problemInfo.getPiid();
		/*
		 * 先判断该问题报告数据是否已存在
		 * 存在就update，不存在则insert
		 */
		ProblemInfo result = null;
		if(piid != null && !"".equals(piid)) {
			result = reportMapper.findByPiid(piid);
		}else{
			result = reportMapper.findByRepId(RepId);
		}
		
		if(result == null) {
			problemInfo.setProcesstype("7");
			
			try {
				//获取最大编号，再自动+1
				Integer maxNum = reportMapper.findMaxProblemNum();
				maxNum = (maxNum == null ? 1 : maxNum+1);
				problemInfo.setProblemnum(maxNum);
				Integer rows = reportMapper.insertOne(problemInfo);
				RepId = problemInfo.getTProblemRepId();
				if(rows != 1) {
					return null;
				}
			}catch (Exception e) {
				e.printStackTrace();
				return null;
			}	
		}else {
			try {
				Integer rows = reportMapper.updateOne(problemInfo);
				
				if(imgList != null && imgList.length > 0) {
					phoMapper.deleteList(imgList);
				}
				if(rows != 1) {
					return null;
				}
			}catch (Exception e) {
				e.printStackTrace();
				return null;
			}
		}
		
		return RepId;
	}
	
	/**   
	 * @Title: getByResavepeopleOrPiid   
	 * @Description: 根据当前登录用户或piid查找问题报告数据
	 * @return: ProblemInfoVO  查到的问题报告数据 
	 */
	@Override
	public ProblemInfoVO getByResavepeopleOrPiid(String resavepeople, String piid) {
		 
		return reportMapper.findByResavepeopleOrPiid(resavepeople, piid);
	}
	
	@Override
	public String verifyApplyPeople(String[] userList) {
		
		String temp = null;
		String msg = null;
		for(int i=0;i<userList.length;i++) {
			String parentID = reportMapper.findApplyPeople(userList[i]);
			if(parentID == null) {
				return "上报人("+userList[i]+")不存在";
			}
			if(temp == null) {
				temp = parentID;
			}else {
				msg = (temp.equals(parentID) ? null:("多个上报人必须属于相同上报部门"));
			}
		}
		
		return msg;
	}
	
	/**   
	 * @Title: ggetProblemInfoByPage   
	 * @Description: 根据条件分页查询出问题上报信息列表
	 * @return: ProblemInfo  查到的问题报告数据列表 
	 */
	@Override
	public List<ProblemInfo> getProblemInfoByPage(ProblemInfo problemInfo, Integer page, Integer limit, String startTime,
			String endTime, String sortField, String sortType) {
		
		sortField = findDataBaseFieldName(sortField);		
		List<ProblemInfo> result = reportMapper.findPorblemInfoByPage(problemInfo, page, limit, startTime, endTime, sortField, sortType);
		return result;
	}
	
	/**   
	 * @Title: ProblemCount   
	 * @Description: 根据条件查询出问题上报信息的条数
	 * @return: Integer   查询数据的条数
	 */
	@Override
	public Map<String, Object> ProblemCount(ProblemInfo problemInfo, String startTime, String endTime) {
		
		return reportMapper.PorblemCount(problemInfo, startTime, endTime);
	}
	
	
	/**
	 * 查找问题属地对应区域
	 * @param  无
	 * @return List<ProblemTypeArea> 问题属地对应区域列表
	 */
	@Override
	public List<ProblemTypeArea> findProblemTypeArea() {
		
		return problemTypeAreaMapper.findAll();
	}
	
	/**   
	 * 根据问题上报主键id删除问题上报记录   
	 * @param repid 问题上报主键
	 * @return: int 删除数据的条数
	 */
	@Override
	public Integer deleteByReportid(String repid) {
		
		try {
			Integer row = reportMapper.deleteByRepid(repid);
			return row;
		}catch (Exception e) {
			log.error("删除数据reportID:{}失败"+repid);
			return null;
		}
	}
	
	/**
	 * Map数据结构存储属性字段与数据库字段的对应关系
	 * key - 实体类属性名   value - 数据库字段名
	 * @return
	 */
	private String findDataBaseFieldName(String key) {
		
		Map<String, String> map = new HashMap<String, String>();
		map.put("applydate", "APPLYDATE");
		map.put("applypeople", "APPLYPEOPLE");
		map.put("welName", "WEL_NAME");
		map.put("problemclass", "PROBLEMCLASS");
		map.put("profession", "PROFESSION");
		map.put("problemtype", "PROBLEMTYPE");
		map.put("problemdescribe", "PROBLEMDESCRIBE");
		map.put("problemstate", "PROBLEMSTATE");
		
		return map.get(key);
	}
	
	/**
	 * 读取excel表批量问题上报
	 */
	@Override
	public String massProblemReport(InputStream is) {
		// TODO Auto-generated method stub
		return null;
	}
}

