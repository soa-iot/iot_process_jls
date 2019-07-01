package cn.soa.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import cn.soa.entity.EquipmentInfo;
import cn.soa.entity.RoleVO;

/**
 * 设备信息持久层接口
 * @author Jiang, Hang
 *
 */
@Mapper
public interface EquipmentInfoMapper {
	
	/**
	 * 根据条件查找出设备信息数据
	 * @param  EquipmentInfo 查询条件
	 * @return 设备信息列表
	 */
	List<EquipmentInfo> findEquInfo(
			@Param("equinfo") EquipmentInfo equinfo, 
			@Param("page") Integer page, 
			@Param("limit") Integer limit);
	
	/**   
	 * 根据条件查统计设备信息条数   
	 * @param: EquipmentInfo 查询条件
	 * @return: 返回条数   
	 */
	Integer countEquipmentInfo(EquipmentInfo info);
}
