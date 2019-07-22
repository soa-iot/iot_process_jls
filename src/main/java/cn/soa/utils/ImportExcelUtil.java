package cn.soa.utils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import cn.soa.entity.ProblemInfoForExcel;
import cn.soa.service.inter.ReportSI;
import cn.soa.service.inter.UserManagerSI;
import lombok.extern.slf4j.Slf4j;

/**
 * 导入读取excel工具类
 * @author Jiang,Hang
 * @date 2019年7月20日
 */
@Slf4j
@Component
public class ImportExcelUtil {
	
	@Autowired
	private ReportSI reportS; 
	
	private static final String[] HEADER_NAMES = {"上报人","属地单位","问题区域","所属专业","设备位号",
			"问题类别","不安全行为","具体行为","问题描述"};
	private static final String[] PROBLEM_LOCATION = {"化验","电站","机械","仪表","净化工段","电工","HSE办公室",
			"设备办","生产办","财务经营办","综合办"};

	 /**
     * 
     * @Title: validateExcel 
     * @Description: 验证EXCEL文件 
     * @return boolean 
     */
	public static boolean validateExcel(String fileName) {
		if(fileName == null) {
			log.error("------------文件名{}不是excel格式", fileName);
			return false;
		}
		return fileName.matches("^.+\\.(?i)(xlsx)$");
	}
	
	 /**
     * @Title: isExcelTemplate
     * @Description: 验证EXCEL文件使用的是否是提供的excel模板文件
     * @return boolean 
     */
	public static boolean isExcelTemplate(XSSFSheet sheet) {
		
		XSSFRow header = sheet.getRow(1);
		if(header == null) {
			log.error("--------上传的excel文件不是模板文件");
			return false;
		}
		short maxCol = header.getLastCellNum();
		if(maxCol < 9) {
			log.error("--------上传的excel文件不是模板文件");
			return false;
		}
		for(int i=0;i<HEADER_NAMES.length;i++) {
			XSSFCell cell = header.getCell(i);
			if(!HEADER_NAMES[i].equals(cell.getStringCellValue())) {
				log.error("--------上传的excel文件不是模板文件");
				return false;
			}
		}
		log.info("--------验证EXCEL文件是否为模板文件成功");
		return true;
	}
	
	/**
     * 
     * @Title: validateRow 
     * @Description: 验证某一行是否为空
     * @return boolean 
     */
	public static boolean validateRow(XSSFRow row, int rownum) {

		for(int j=0;j<9;j++) {
			XSSFCell cell = row.getCell(j);
			if(cell == null) {
				throw new RuntimeException("第"+rownum+"行数据不符合要求");
			}
			
			String cellValue = "";
			if (cell.getCellTypeEnum() == CellType.STRING) {
				cellValue = cell.getStringCellValue().trim();
			}
			if (cell.getCellTypeEnum() == CellType.NUMERIC) {
				cellValue = Double.toString(cell.getNumericCellValue());
			}
			
			if(!cellValue.equals("")) {
				return false;
			}
		}
		return true;
	}
	
	/**
     * @Title: readExcelValue
     * @Description: 读取Excel信息
     * @return List<T> 对象集合 
     */
	public List<ProblemInfoForExcel> readExcelValue(XSSFWorkbook workbook, short sheetIndex, String deptName){
		List<ProblemInfoForExcel> list = new ArrayList<>();
		
		XSSFSheet sheet = workbook.getSheetAt(sheetIndex);
		//得到数据最后一行数
		int lastRowNum = sheet.getLastRowNum();
		
		end:
		for(int i=2; i<=lastRowNum; i++) {
		   // 得到Excel的列数
			XSSFRow row = sheet.getRow(i);
			System.err.println("row"+i+"="+row.getLastCellNum());
			if(row == null || row.getLastCellNum() < 9) {
				throw new RuntimeException("第"+(i+1)+"行数据不符合要求");
			}
			 // 循环Excel的列
			ProblemInfoForExcel porblemInfo = new ProblemInfoForExcel();
			for(int j=0;j<9;j++) {
				XSSFCell cell = row.getCell(j);
				if(cell == null) {
					throw new RuntimeException("第"+(i+1)+"行数据不符合要求");
				}
				
				String cellValue = "";
				if (cell.getCellTypeEnum() == CellType.STRING) {
					cellValue = cell.getStringCellValue().trim();
				}
				if (cell.getCellTypeEnum() == CellType.NUMERIC) {
					cellValue = Double.toString(cell.getNumericCellValue());
				}
				
				if(j != 6 && j != 7 && cellValue.isEmpty()) {	
					if(j == 0 && validateRow(row, i+1)) {
						lastRowNum = i-1;
						break end;
					}
					throw new RuntimeException("第"+(i+1)+"行数据不符合要求");
				}
				
				/*if(j == 0) {
					String[] userList = null;
					if(cellValue.contains(",")) {
						userList = cellValue.split(",");
					}else if(cellValue.contains("，")) {
						userList = cellValue.split("，");
					}
					String result = reportS.verifyApplyPeople(userList);
					if(result != null) {
						throw new RuntimeException("第"+(i+1)+"行："+result);
					}
				}*/
				
				if(j == 1) {
					if(!Arrays.toString(PROBLEM_LOCATION).contains(cellValue)) {
						throw new RuntimeException("第"+(i+1)+"行属地单位填写不符合要求");
					}
				}
				switch(j) {
				case 0:
					porblemInfo.setApplypeople(cellValue);
					break;
				case 1:
					porblemInfo.setProblemtype(cellValue);
					break;
				case 2:
					porblemInfo.setWelName(cellValue);
					break;
				case 3:
					porblemInfo.setProfession(cellValue);
					break;
				case 4:
					porblemInfo.setRfid(cellValue);
					break;
				case 5:
					porblemInfo.setProblemclass(cellValue);
					break;
				case 6:
					porblemInfo.setRemarkfive(cellValue);
					break;
				case 7:
					porblemInfo.setRemarksix(cellValue);
					break;
				case 8:
					porblemInfo.setProblemdescribe(cellValue);
				}
			}
			porblemInfo.setApplydate(new Date());
			porblemInfo.setDept(deptName);
			porblemInfo.setProblemstate("UNFINISHED");
			list.add(porblemInfo);
		}
		if(lastRowNum < 2) {
			throw new RuntimeException("Excel表里没有数据");
		}
		System.out.println(list);
		
		return list;
	}
}