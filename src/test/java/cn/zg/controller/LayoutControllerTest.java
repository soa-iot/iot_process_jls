package cn.zg.controller;

import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import cn.zg.entity.daoEntity.LayoutTemplate;
import cn.zg.entity.dataExchange.ResultJson;
import cn.zg.entity.serviceEntity.ComponentsInstanceInfo;
import cn.zg.start.H5PageGenerateApplication;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = { H5PageGenerateApplication.class })
@WebAppConfiguration
public class LayoutControllerTest {
	@Autowired
	private LayoutController layoutController;
	
	@Test
	public void selectAll(){
		ResultJson<List<LayoutTemplate>> r = layoutController.getLayoutController();
		System.out.println(r);
	}
}