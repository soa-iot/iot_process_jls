
/**
 * 全局变量——piid
 */
var piidp = GetQueryString('piid');
/**
 * 全局变量——属地单位
 */
var area = GetQueryString('area');
console.log(area);

/**
 * 日期插件
 */
layui.use('laydate', function(){
	var laydate = layui.laydate;

	//常规用法
	laydate.render({
		elem: '#sdate'
	});

});

/**
 * 轮播图
 */
layui.use(['carousel', 'form'], function(){
	var carousel = layui.carousel
	,form = layui.form;

	//常规轮播
	carousel.render({
		elem: '.imgshow'
		//,arrow: 'always'
			//,width: '778px'
		,height: '150px'
		,interval: 5000
	});
});  

/**
 * 折叠
 */
layui.use([ 'element', 'layer' ], function() {
	var element = layui.element;
	var layer = layui.layer;

});


/**
 * 信息问题请求
 */
var pd="";
$.ajax({  
	url : "/iot_process/estimates/estim",  
	type : "get",
	data : {piid : piidp},
	dataType : "json",  
	success: function( json) {
		if (json.state == 0) {
			var problem = json.data;
			//era=problem.problemtype;
			$("#parea").val(problem.welName);
			$("#major").val(problem.profession);
			$("#rfid").val(problem.rfid);
			$("#prob").val(problem.problemclass);
			$("#applypeople").val(problem.applypeople);
			$("#problemtype").val(problem.problemtype);

			if (problem.problemclass=="不安全行为/状态") {
				$("#remark1").val(problem.remarkfive);
				$("#remark2").val(problem.remarksix);
				$("#remark").show();
			}else {
				$("#remark").hide();
			}
			$("#problem_describe").val(problem.problemdescribe);
			if (problem.ticketNo != null && problem.remark != null) {
				$("#ticketNo").val(problem.ticketNo);
				if (problem.remark=="大修时整改") {
					$("#sele").val(problem.remark);
					$("#sdateall").hide();
				}
			}
			if (problem.rectificationperiod != null) {
				$("#sdate").val(json.data.rectificationperiod.match(/\d+-\d+-\d+/));
			}
			pd=problem.problemdescribe;
		}

	}  
});

/**
 *问题图片
 */
$.ajax({  
	url : "/iot_process/estimates/problemreportpho",  
	type : "get",
	data : {piid : piidp,remark:0},
	dataType : "json",  
	success: function( json) {
		if (json.state == 0) {
			var imgs = json.data;
			if (imgs.length==0) {
				$("#imag").html("无图");
			}else{
			var mode = imgs.length%3;
			var img_id = 0;
			console.log("图片路径："+imgs[img_id].phoAddress);
			for (var j = 0; j < Math.ceil(imgs.length/3); j++) {
				var img_div='<div class="img_p">';
				if (mode != 0 && j == (Math.ceil(imgs.length/3) - 1) ) {
					//img_div = '';

					for (var i = 0; i < mode; i++) {
						img_div = img_div+'<img  class="big-img"  data-method="offset" alt="图片无法显示" src="'+imgs[img_id].phoAddress+'">';
						img_id++;
					}

				}else{

					for (var i = 0; i < 3; i++) {
						img_div = img_div+'<img class="big-img"  data-method="offset" alt="图片无法显示" src="'+imgs[img_id].phoAddress+'">';
						
						img_id++;
					}

				}
				img_div = img_div+'</div>'
				$("#imag").append(img_div);
			}
			}
		}

	}  
});

/**
 * 处理过程表格
 */
layui.use('table', function(){
	var table = layui.table;

	//第一个实例
	table.render({
		elem: '#process'
			//,height: 200
			//,width:'90%' //piid:processPure2:3:32523
			,url: '/iot_process/process/nodes/historyTask/piid/'+piidp //数据接口
			// ,page: true //开启分页
			,parseData: function(res) { //res 即为原始返回的数据
				return {
					"code": res.state, //解析接口状态
					"msg": res.message, //解析提示文本
					"count": res.length, //解析数据长度
					"data": res.data //解析数据列表
				}
			}
	//,format:'yyyy-MM-dd'
	,cols: [[ //表头
		{field: 'nodeExecutor', title: '处理人', width:'25%'}
		,{field: 'nodeName', title: '处理节点', width:'25%'}
		,{field: 'nodeComment', title: '处理说明', width:'25%'}
		,{field: 'nodeEndTime', title: '时间', width:'25%',templet:"<div>{{layui.util.toDateString(d.nodeEndTime,'yyyy-MM-dd HH:mm:ss')}}</div>"} 
		]]
	});

});

/**
 * 非净化工段问题处理更新ajax
 */
function modifyEstimated(obj) {
	//问题描述
	var problem_describe = $("#problem_describe").val();

	//问题处理信息
	var str = "problemdescribe="+problem_describe+"&piid="+piidp+"&"+$("#estimate").serialize();

	var period = $("#sdate").val();

	//日期格式处理
	if (period == "") {
		str = str.replace(/rectificationperiod=(\d+-\d+-\d+)/,period);
	}else{
		period = period.replace(/-/g, "/");
		str = str.replace(/rectificationperiod=(\d+-\d+-\d+)/,"rectificationperiod="+period);
	}
	console.log("日期格式处理："+str);

		$.ajax({  
			url : "/iot_process/estimates/modifyestimated",  
			type : "post",
			data : str,
			dataType : "json",  
			success: function( json) {
				console.log("问题处理json："+json);
				if (json.state==0) {
					//if ($(obj).attr("id")=="work_plant") {
						
						layer.msg("提交成功！",{time: 3000,icon:1},function() {
							
							//window.location.href = "http://"+getUrlIp()+"/iot_usermanager/html/userCenter/test.html";
						});
//					}else{
//						layer.msg("提交成功！",{time: 3000,icon:1});
//					}
					
					//window.location.href=getUrlIp()+"/iot_usermanager/html/userCenter/index.html";

				}else{
					layer.msg("提交失败！",{time: 3000,icon:2});
				}
			}  
		});

}

/**
 * 问题评估前端验证
 * @returns true or false
 */
function yesCompare(){
	
	//问题描述
	var problem_describe = $("#problem_describe").val();

	//问题处理信息
	var str = "problemdescribe="+problem_describe+"&piid="+piidp+"&"+$("#estimate").serialize();

	var period = $("#sdate").val();
	var date_amtch = period.match(/^(\d{4})(-)(\d{2})(-)(\d{2})$/);

	if (($("#sele").val() =="指定日期" && period=="") || ($("#sele").val() =="指定日期" && date_amtch == null)) {
		layer.msg('请正确输入指定日期！！！',{icon:7});
		return false;
	}else if(problem_describe == ""){
		layer.msg('问题描述不能为空！！！',{icon:7});
		return false;
	}else if ($("#comment").val()=="") {
		layer.msg('处理说明不能为空！！！',{icon:7});
		return false;
	}else{
		return true;
	}
	
}

/**
 * 图片点击放大
 * @returns
 */
//弹出层
layui.use('layer', function(){ //独立版的layer无需执行这一句
	var $ = layui.jquery, layer = layui.layer; //独立版的layer无需执行这一句
	
	
	//触发事件
	var active = {
			offset: function(othis){
				
			var imgHtml= "<img alt='图片无法显示' src='"+$(this).attr("src")+"'width='600px'  height='500px'/>";
				//var type = othis.data('type')
				layer.open({
				type: 1
				//,offset: type 
				,area: ['600px','500px']
				,content: imgHtml
				,title:false
				//,shadeClose:true
				//,cancel:false
				,offset:'auto'
				
				});
			}
	};

	$('.big-img').on('click', function(){
		var othis = $(this), method = othis.data('method');
		active[method] ? active[method].call(this, othis) : '';
	});

});



/**
 * 指定日期禁用
 */
layui.use(['layer', 'jquery', 'form'], function () {
	var layer = layui.layer,
			$ = layui.jquery,
			form = layui.form;

	form.on('select(dateChange)', function(data){
		if(data.value == "大修时整改"){
			console.log("---指定日期--------"+data);
			$("#sdate").val("");
			$("#sdate").attr("disabled","disabled");
			$("#sdateall").hide()
			form.render('select');
		}else{
			$("#sdateall").show()
			$("#sdate").removeAttr("disabled");
			form.render('select');//select是固定写法 不是选择器
		}
	});
});

/**
 * 回退
 */
$("#rollback").click(function(){

		if (yesCompare()) {
			$.ajax({
			     type: "PUT"
			     ,url: '/iot_process/process/nodes/before/group/piid/'+piidp    //piid为流程实例id
			     ,data: {
			     	"comment": $("#comment").val()  //处理信息
			     	,"userName":$.cookie("name").replace(/"/g,"")
			     }  
			     ,contentType: "application/x-www-form-urlencoded"
			     ,dataType: "json"
			     ,success: function(jsonData){
			     	if (jsonData.data==true) {
			     		modifyEstimated(this);
					}else{
						layer.msg(jsonData.message,{icon:2});
					}
			     },
			});
			
		}
});

/**
 * 判断是人还是部门
 * @returns是人返回人名，是部门返回空串
 */
function userOrDept(checData){
	var checDatas = checData.split(",");
	if (checDatas[1]==1) {
		return checDatas[0];
	}else{
		return ""
	}
}

/**
 * 获取当前所选部门
 * @returns是人返回部门名称
 */
function deptOrDeptUser(checData){
//	var dapto = "";
	var checDatas = checData.split(",");
	
	console.log("判断："+ (checDatas[1]==0));
	if (checDatas[1]==0) {
		return checDatas[0];
	}else{
		return "";
	}
//	console.log("判断："+depto);
//	return depto;
}

/**
 * 两人判断是否为同一部门
 * @param checData1 
 * @param checData2
 * @returns
 */
function compareTodept(checData1,checData2){
	
	var checData1s = checData1.split(",");
	var checData2s = checData2.split(",");
	if (checData1s[2]==checData2s[2]) {
		return true;
	}else{
		return false;
	}
}

/**
 * 获取外部协调数据
 * @returns
 */
function outhelper_data(outhelperData){
	var out_data_tree=[{label:"龙王庙天然气净化厂",id:"龙王庙天然气净化厂,0",children:[]}];
	var data = [];
	
	for ( var key in outhelperData) {
		
			if (key != "龙王庙天然气净化厂") {
				$.ajax({  
					//url : "http://localhost:10238/iot_usermanager/user/roleName",  
					url : "/iot_process/userOrganizationTree/userOrganizationOrgan",  
					type : "get",
					//$.cookie("organ")$.cookie("name")
					data : {organ:outhelper[key],username:"无"},
					dataType : "json",  
					async:false,
					success: function(json) {
	
						if (json.code == 0) {
							var datapro = json.data;
							//数据初始化
							data = buildTree(datapro);
	
						}
					}
				})
				
				if (data.length == 0) {
					data = {label: key 
							,id:key+",0"
							,disabled:true
							,children: data}
				}else{
					data = {label: key 
							,id:key+",0"
							,children: data}
				}
				
				out_data_tree[0].children[out_data_tree[0].children.length] = data;
			}
		
	}
	
	console.log(out_data_tree)
	return out_data_tree;
}


/**
 * 闭环处理
 * @returns
 */

$("#complete").click(function(){

	if (yesCompare()){

		$.ajax({
			type: "PUT"
			,url: '/iot_process/process/nodes/end/group/piid/'+piidp    //piid为流程实例id
			,data: {

				"comment": $("#comment").val()     //节点的处理信息
				,"userName":$.cookie("name").replace(/"/g,"")

			}   //问题上报表单的内容
			,contentType: "application/x-www-form-urlencoded"
			,dataType: "json"
			,success: function(jsonData){
				//后端返回值： ResultJson<Boolean>
				
				if (jsonData.state==0) {
					modifyEstimated(this);
				}else{
					layer.msg("数据提交失败！！",{icon:2});
				}
			},
				//,error:function(){}		       
		});
	}

})

/**
 * 外部协调
 */
$("#coordinate_tree").hide();
var coordinate_tree ;

//tree
layui.use('tree', function(){
	
	delete outhelper[area];
	console.log(outhelper);
	
	var tree = layui.tree
	,outhelperData= outhelper
	,layer = layui.layer
	,data = outhelper_data(outhelperData)
	,usernames = "";
	
	
	//弹出层
	layui.use('layer', function(){ //独立版的layer无需执行这一句
		var $ = layui.jquery, layer = layui.layer; //独立版的layer无需执行这一句
		//触发事件
		var active = {
				offset: function(othis){
					var type = othis.data('type')
					layer.open({
						type: 1
						,offset: type 
						,area: ['300px','400px;']
					,id: 'coordinate'+type //防止重复弹出
					,key:'id'
						,content: $("#coordinate_tree")
						,btn: ['确认',"取消"]
					,btnAlign: 'c' //按钮居中
						,yes: function(){
							
							var check = coordinate_tree.getChecked(); //获得被勾选的节点
							console.log(check);
							var dept = "";
							for (var i = 0; i < check.length; i++) {
								
								var dept_one;
								var depts = deptOrDeptUser(check[i][1]);
								if (depts != "") {
									if (dept != "") {
										layer.msg('请选择同一部门的人！！！',{icon:7});
										return;
									}
									dept_one = depts;
								}else{
									dept = dept_one;
								}
								console.log(dept_one) 
								
								usernames += userOrDept(check[i][1]);
								if (usernames != "" && userOrDept(check[i][1]) != "" && i != check.length - 1) {
									usernames += ",";
								}
								
							}
							
							console.log("选择的部门："+dept);
							
							//如果最后面是","就去掉
							if (usernames.charAt(usernames.length - 1) == ",") {
								usernames = usernames.substring(0,usernames.length - 1);
							}
							console.log("外部协调选中的人："+usernames);
							
							if (usernames != "") {
								
								if (area == "净化工段" && dept == "维修工段") {
									outhelper_pure(this,usernames);
								}else{
									outhelperm(this,dept,usernames);
								}
								usernames="";
								
								layer.closeAll();
							}else{
								layer.msg('至少选择一个人！！！',{icon:7});
							}
							
							
						}
					,success:function(){
						//console.log(data);
						//开启复选框
						coordinate_tree = tree.render({
							
							elem: '#coordinate_tree'
								,data: data
								,showCheckbox: true
						})
					}
					});
				}
		};
		
		$('#coordinate').on('click', function(){
			var othis = $(this), method = othis.data('method');
			active[method] ? active[method].call(this, othis) : '';
		});
		
	});
	
	
});

/**
 * 外部协调提交请求
 * @returns
 */
function outhelperm(obj,dept,usernames){
	
	var actualIds = dept == "净化工段" || dept == "净化工段" ?actualId[dept]:actualId["其他"];
	console.log("actualId:"+actualIds);
	
	var actualVars = dept == "净化工段" || dept == "净化工段" ?actualVar[dept]:actualVar["其他"];
	console.log("actualId:"+actualVars);
	
	var data_out = {
			
			"area": dept //属地单位
			,"actId": actualIds  //跳转节点id
		     								 
			,"comment": $("#comment").val()     //节点的处理信息
			//,"estimators":usernames //下一步流程变量
			,"userName":$.cookie("name").replace(/"/g,"")
		}
	data_out[actualVars] = usernames;
	
	for ( var key in data_out) {
		console.log("data_out:"+key+":"+data_out[key]);
		
	}
	
	$.ajax({
		type: "PUT"
		,url: '/iot_process/process/nodes/jump/group/piid/'+piidp    //piid为流程实例id
		,data:data_out    //问题上报表单的内容
			
		,contentType: "application/x-www-form-urlencoded"
		,dataType: "json"
		,success: function(jsonData){
			//后端返回值： ResultJson<Boolean>
			if (jsonData.data) {
				(this);
			}else{
				layer.msg('安排人员发送失败！！！',{icon:7});
			}
		}
		//,error:function(){}		       
	});
}

/**
 * 净化工段外部协调
 * @param obj
 * @param dept
 * @param usernames
 * @returns
 */
function outhelper_pure(obj,usernames){
$.ajax({
    type: "PUT"
    ,url: '/iot_process/process/nodes/next/group/piid/'+piidp    //piid为流程实例id
    ,data: {
    	"comment": $("#comment").val()     //通用 -- 节点的处理信息
    	,"repairor": usernames    
    	,"userName": $.cookie("name").replace(/"/g,"")    //当前任务的完成人
    }   //问题上报表单的内容
    ,contentType: "application/x-www-form-urlencoded"
    ,dataType: "json"
    ,success: function(jsonData){
    	//后端返回值： ResultJson<Boolean>
    	if (jsonData.data) {
			modifyEstimated(this);
		}else{
			layer.msg('安排人员发送失败！！！',{icon:7});
		}
    }
    //,error:function(){}		       
});}
