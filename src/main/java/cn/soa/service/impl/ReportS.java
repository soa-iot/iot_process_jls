package cn.soa.service.impl;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cn.soa.dao.ProblemInfoMapper;
import cn.soa.dao.ProblemReportphoMapper;
import cn.soa.entity.ProblemInfo;
import cn.soa.entity.ProblemInfoVO;
import cn.soa.entity.ProblemReportpho;
import cn.soa.service.inter.ReportSI;


@Service
public class ReportS implements ReportSI {
	
	@Autowired
	private ProblemInfoMapper reportMapper;
	@Autowired
	private ProblemReportphoMapper phoMapper;
	
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
}

