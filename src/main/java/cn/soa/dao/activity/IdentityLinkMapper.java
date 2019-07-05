package cn.soa.dao.activity;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import cn.soa.entity.activity.IdentityLink;

@Mapper
public interface IdentityLinkMapper {
	
	/**   
	 * @Title: findCandidateByTsid   
	 * @Description: 根据任务tsid查询流程当前代办人  
	 * @return: List<IdentityLink>        
	 */  
	List<IdentityLink> findCandidateByTsid( String tsid );
	
}
