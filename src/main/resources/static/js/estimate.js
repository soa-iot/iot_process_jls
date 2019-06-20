/**作业安排*/

/**
 * 全局变量——piid
 */
var piidp = GetQueryString('piid');
console.log("actualId"+actualId["其他"]);
/**
 * 全局变量——属地单位
 */
var area = GetQueryString('area');
console.log(area+","+piidp);


/**
 * 作业安排
 * @param obj
 * @returns
 */
var usernames="";
//如果为这个几个部门这显示全厂人员
//var era = "生产办公室";
var url = area=='生产办公室' || area == 'HSE办公室' || area == '设备办公室'?'../html/organization_tree.html':'../html/organization_tree_problemtype.html?area='+area;
console.log(area);
//弹出层
layui.use('layer', function(){ //独立版的layer无需执行这一句
	var $ = layui.jquery, layer = layui.layer; //独立版的layer无需执行这一句
	//触发事件
	var active = {
			offset: function(othis){
				var type = othis.data('type')
				var ope = layer.open({
				type: 1
				,offset: type 
				,area: ['300px','400px;']
				,id: 'work_plan'+type //防止重复弹出
				,key:'id'
					//../html/organization_tree.html
				,content: '<iframe frameborder="no" id="addFrame" src="'+url+'" style="width:98%;height:98%;"></iframe>'
				,btn: ['确认',"取消"]
				,btnAlign: 'c' //按钮居中
					,yes: function(){

						var childWindow = $("#addFrame")[0].contentWindow;
						var checkData = childWindow.getCheckedData();
						console.log(checkData);
						for (var i = 0; i < checkData.length; i++) {
							
							//console.log(checkData[i][1]);
							var user=userOrDept(checkData[i][1]);
							if (user!="") {
								//对比是否为同一部门
								if (i < checkData.length - 2) {
									if (!compareTodept(checkData[i][1],checkData[i+1][1])) {
										layer.msg('请选择同一部门的人！！！',{icon:7});
										return;
									}
									
								}
								
								usernames +=user;
								if (i!=checkData.length-1) {
									usernames +=",";
								}
							}
						}
						console.log("选中的人："+usernames);
	
						if (usernames=="") {
							layer.msg('至少选定一人！！！',{icon:7});
						}else if (yesCompare()) {
							workPlan(this,usernames);
							usernames="";	
	
							layer.close(ope);
						}
					}
				});
			}
	};

	$('#work_plan').on('click', function(){
		var othis = $(this), method = othis.data('method');
		active[method] ? active[method].call(this, othis) : '';
	});

});

/**
 * 外部协调
 */
$("#coordinate_tree").hide();
var coordinate_tree ;

//tree
layui.use('tree', function(){
	
	delete outhelper["维修工段"];
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
							var dept;
							for (var i = 0; i < check.length; i++) {
								usernames += userOrDept(check[i][1]);
								if (usernames != "" && userOrDept(check[i][1]) != "" && i != check.length - 1) {
									usernames += ",";
								}
								var depts = deptOrDeptUser(check[i][1]);
								if (depts != "") {
									dept = depts;
								}
								
							}
							
							console.log("选择的部门："+dept);
							
							if (usernames.charAt(usernames.length - 1) == ",") {
								usernames = usernames.substring(0,usernames.length - 1);
							}
							console.log("外部协调选中的人："+usernames);
							
							if (usernames != "") {
								outhelperm(this,dept,usernames);
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
/*$.ajax({  
	url : "http://localhost:8080/iot_process/estimates/problemtype",  
	type : "get",
	data : {problemtype:area},
	dataType : "json",  
	success: function( json) {
		//console.log(json.state);
		if (json.state == 0) {
			var datapro = json.data;


		}

	}  
});*/

/**
 * 作业安排确认提交
 * 
 * @param obj 当前对象
 * @param usernames 人名用“，”隔开
 * @returns
 */
function workPlan(obj,usernames){
	var isIngroup;
	
	console.log("id:"+$(obj).attr("id"));
	console.log("id判断:"+$(obj).attr("id")=="work_plant");
	
	if ($(obj).attr("id")=="work_plant") {
		isIngroup = 1;
	}
	
	if ($(obj).attr("id")=="coordinatet") {
		isIngroup = 2;
	}
	console.log(isIngroup);
	$.ajax({
		type: "PUT"
		,url: '/iot_process/process/nodes/next/group/piid/'+piidp    //piid为流程实例id
		,data: {
			"isIngroup": isIngroup,    /*流程变量名称,流程变量值(属地单位为非维修非净化+前端选择"作业安排"时，值为1；
		     								   属地单位为非维修非净化+前端选择"外部协调"时，值为2；
		     								   属地单位为维修或净化+前端选择"作业安排"时，值为1；
		     								    属地单位为维修或净化+前端选择"下一步"时，值为3 )*/
			"comment": $("#comment").val(),     //节点的处理信息
			"estimators":usernames,
			"userName":$.cookie("name")
		}   //问题上报表单的内容
		,contentType: "application/x-www-form-urlencoded"
		,dataType: "json"
		,success: function(jsonData){
			//后端返回值： ResultJson<Boolean>
			console.log("人员提交："+jsonData.data);
			if (jsonData.data) {
				modifyEstimated(this);
			}else{
				layer.msg('安排人员发送失败！！！',{icon:7});
			}
		},
		//,error:function(){}		       
	});
}

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
			
			"area": area //属地单位
			,"actId": actualIds  //跳转节点id
		     								 
			,"comment": $("#comment").val()     //节点的处理信息
			//,"estimators":usernames //下一步流程变量
			,"userName":$.cookie("name")
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
			console.log("人员提交："+jsonData.data);
			if (jsonData.data) {
				modifyEstimated(this);
			}else{
				layer.msg('安排人员发送失败！！！',{icon:7});
			}
		},
		//,error:function(){}		       
	});
}