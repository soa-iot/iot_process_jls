layui.use(['tree', 'layer', 'form'], function() {
	var tree = layui.tree, layer = layui.layer, $ = layui.$;
	var layer = layui.layer, form = layui.form;
	
	$("#sdate").val("");
	var treeResult, assignUsers = new Array();
	
	//从cookie中获取当前登录用户
	var resavepeople = getCookie1("name").replace(/"/g,'');
	
	/**
	 * 作业指派异步请求
	 */
	function workAssignment(comment, arrangor, username){
		$.ajax({
			 async: false
		     ,type: "PUT"
		     ,url: '/iot_process/process/nodes/next/group/piid/'+piidp    //piid为流程实例id
		     ,data: {
		     	"comment": comment     //通用 -- 节点的处理信息
		     	,"arrangor": arrangor     //通用 -- 下一个节点问题处理人
		     	,"userName": username    //当前任务的完成人
		     }   //问题上报表单的内容
		     ,contentType: "application/x-www-form-urlencoded"
		     ,dataType: "json"
		     ,success: function(jsonData){
		     	//后端返回值： ResultJson<Boolean>
		    	 if(jsonData.data){
		    		 layer.msg("作业指派成功",{icon:1, time: 2000}, function(){
		    			 window.location.href = "http://localhost:10238/iot_usermanager/html/userCenter/test.html";
		    		 })
		    	 }else{
		    		 layer.msg("作业指派失败",{icon:2, time: 2000});
		    	 }
		     }
		     ,error:function(){
		    	 layer.msg("作业指派失败",{icon:2, time: 2000});
		     }		       
		});
		
	    return false;
	}
	
	/**
	 * 校验表单是否为空, 为空则不弹出层
	 */
	form.on('submit(assignment)', function(data){
		if($("#sele").val() == '指定日期' && !$("#sdate").val()){
			layer.msg("指定日期不能为空",{icon: 5});
			return false;
		}
		assignUsers.length = 0;
		//弹出层
		layer.open({
			type: 1
			,offset: 'auto'
			,area: ['300px','400px;']
			,id: 'work_assignment'+1 //防止重复弹出
			,content: $("#task_tree")
			,btn: ['确认',"取消"]
			,btnAlign: 'c' //按钮居中
			,yes: function(index, layero){
				//确认按钮的回调函数
				var comment = $("#comment").val();
				var arrangor = assignUsers.join("，");
				console.log(arrangor);
				if(assignUsers.length < 1){
					layer.msg("至少选择一名人员", {icon:7});
				}else{
					workAssignment(comment, arrangor, resavepeople);
				}
				//layer.closeAll();
		    }
		,success:function(){	
			//单选框
			tree.render({
				elem: '#task_tree'
				,data: treeResult
				,showCheckbox: true
				,oncheck:function(obj){
					parseTree(obj);
					console.log(assignUsers);
				}
				,
			})
			// 人名前面 显示人形图标
			$("i.layui-icon-file").addClass("layui-icon-user");
		 }
		});
	    return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
	    
	});
	
	/**
	 * 异步请求人员角色树
	 */
	$.ajax({
		url : '/iot_process/estimates/repairlist',
		type : 'GET',
		dataType : 'json',
		data : {},
		success : function(json) {
			treeResult = json.data;
		},
		error : function() {
		}
	});
	
	
	/**
	 * 闭环流程
	 */
	form.on('submit(complete)', function(data){
		
		$.ajax({
		     type: "PUT"
		     ,url: '/iot_process/process/nodes/end/piid/'+piidp   //piid为流程实例id
		     ,data: {
		     	"comment": data.field.comment  //处理信息
		     }  
		     ,contentType: "application/x-www-form-urlencoded"
		     ,dataType: "json"
		     ,success: function(jsonData){
		     	//后端返回值： ResultJson<String>
		    	 if(jsonData){
		    		 layer.msg("闭环处理成功",{icon:1, time: 2000}, function(){
		    			 window.location.href = "http://localhost:10238/iot_usermanager/html/userCenter/test.html";
		    		 })
		    	 }else{
		    		 layer.msg("闭环处理失败",{icon:2});
		    	 }
		     },
		     error:function(){
		    	 layer.msg("闭环处理失败",{icon:2});
		     }		       
		});
		
		return false;
	});
	
	/**
	 * 回退到上一个节点
	 */
	form.on('submit(back_previous)', function(data){

		$.ajax({
		     type: "PUT"
		     ,url: '/iot_process/process/nodes/before/group/piid/'+piidp   //piid为流程实例id
		     ,data: {
		     	"comment": data.field.comment  //处理信息
		     	,"userName": resavepeople
		     }  
		     ,contentType: "application/x-www-form-urlencoded"
		     ,dataType: "json"
		     ,success: function(jsonData){
		     	//后端返回值： ResultJson<String>
		    	 if(jsonData){
		    		 layer.msg("回退成功",{icon:1, time: 2000}, function(){
		    			 window.location.href = "http://localhost:10238/iot_usermanager/html/userCenter/test.html";
		    		 })
		    	 }else{
		    		 layer.msg("回退失败",{icon:2});
		    	 }
		     },
		     error:function(){
		    	 layer.msg("回退失败",{icon:2});
		     }		       
		});
		
		return false;
	});
	
	
	/**
	 * 外部协助跳转
	 */
	form.on('submit(out_coordinate)', function(data){
		assignUsers.length = 0;
		//弹出层
		layer.open({
			type: 1
			,offset: 'auto'
			,area: ['300px','400px;']
			,id: 'out_coordinate'+1 //防止重复弹出
			,content: $("#task_tree")
			,btn: ['确认',"取消"]
			,btnAlign: 'c' //按钮居中
			,yes: function(index, layero){
				//确认按钮的回调函数
				if(assignUsers.length < 1){
					layer.msg("至少选择一名人员", {icon:7});
				}else{
					out_coordinate();
				}
				//layer.closeAll();
		    }
		,success:function(){	
			//单选框
			tree.render({
				elem: '#task_tree'
				,data: outhelper_data(outhelper)
				,showCheckbox: true
				,oncheck:function(obj){
					parseTree(obj);
					console.log(assignUsers);
				}
				,
			})
			// 人名前面 显示人形图标
			$("i.layui-icon-file").addClass("layui-icon-user");
		 }
		});
	    return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
	});
	
	
	function out_coordinate(){
		$.ajax({
		     type: "PUT"
		     ,url: '/iot_process/process/nodes/jump/group/piid/'+piidp   //piid为流程实例id
		     ,data:{
			     	"area": $("#problemtype").val()   //属地单位
					,"actId": "estimate"  //跳转节点id
					,"estimators": assignUsers.join("，")  //下一步流程变量
					,"userName": resavepeople  //当前节点任务执行人
					,"comment": $("#comment").val()  //备注信息
			 }  
		     ,contentType: "application/x-www-form-urlencoded"
		     ,dataType: "json"
		     ,success: function(jsonData){
		     	//后端返回值： ResultJson<String>
		    	 if(jsonData){
		    		 layer.msg("外部协调请求成功",{icon:1, time: 2000}, function(){
		    			 window.location.href = "http://localhost:10238/iot_usermanager/html/userCenter/test.html";
		    		 })
		    	 }else{
		    		 layer.msg("外部协调请求成功",{icon:2});
		    	 }
		     },
		     error:function(){
		    	 layer.msg("外部协调请求成功",{icon:2});
		     }		       
		});
	}
	
	
	/**
	 * 解析树型结构,获取选中人员信息
	 */
	function parseTree(obj){
		 //console.log(obj.data); //得到当前点击的节点数据
		 // console.log(obj.checked); //得到当前节点的展开状态：open、close、normal
		 var data = obj.data;
		 //选中就添加人员
		 if(obj.checked){
			 getUser(data);
		 }else{
			 //去掉选中就删除人员
			 removeUser(data);
		 }
	}
	
	function getUser(data){
		if(data.children == null || data.children == undefined){
			assignUsers.push(data.label);
		 }else{
			for(var i=0;i<data.children.length;i++){
				getUser(data.children[i]);
			}
		 }
	}
	
	function removeUser(data){
		if(data.children == null || data.children == undefined){
			for(var i=0;i<assignUsers.length;i++){
				if(assignUsers[i] == data.label){
					assignUsers.splice(i,1);
				}
			}
	    }else{
	    	for(var i=0;i<data.children.length;i++){
	    		removeUser(data.children[i]);
			}
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
			
				if (key != "龙王庙天然气净化厂" && key != "净化工段" && key != '维修工段') {
					$.ajax({    
						url : "/iot_process/userOrganizationTree/userOrganizationOrgan",  
						type : "get",
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
		return out_data_tree;
	}
});