package cn.soa.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import cn.soa.entity.UserOrganization;

@Mapper
public interface UserOrganizationTreeMapper {
	
	/**
	 * 查询所有数据
	 * @return
	 */
	List<UserOrganization> findAll(); 
	
	/**
	 * 根据属地查询当前属地的下一级组织或人员dao层
	 * @return
	 */
	List<UserOrganization> findUserOrganizationByName(String name); 
	
	/**
	 * 根据属地id查询当前属地的下一级人员dao层
	 * @return
	 */
	List<UserOrganization> findUserOrganizationByParentId(String usernum);

   
}