package cn.soa.service.impl;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cn.soa.dao.activity.IdentityLinkMapper;
import cn.soa.entity.activity.IdentityLink;
import cn.soa.service.inter.AcitivityIdentitySI;

@Service
public class AcitivityTaskS implements AcitivityIdentitySI{
	private static Logger logger = LoggerFactory.getLogger( AcitivityTaskS.class );
	
	@Autowired
	private IdentityLinkMapper identityLinkMapper;
	
	/**   
	 * @Title: findCandidateByTsid   
	 * @Description: 根据任务tsid查询流程当前代办人  
	 * @return: List<IdentityLink>        
	 */  
	public List<IdentityLink> findCandidateByTsid( String tsid ){
		logger.info( "---S--------根据任务tsid查询流程当前代办人  -------------" );
		if( StringUtils.isBlank( tsid ) ) {
			logger.info( "---S--------任务tsid为null或空-------------" );
			return null;
		}	
		
		
		
		try {
			
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
		return null;
	}
	
}
