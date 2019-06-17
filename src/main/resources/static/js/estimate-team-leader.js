$("#coordinate_tree").hide();
var coordinate_tree ;

//数据初tree数据声明
var coordinate_tree_data=[];
$.ajax({  
	//url : "http://localhost:10238/iot_usermanager/user/roleName",  
	url : "/iot_process/userOrganizationTree/userOrganizationArea",  
	type : "get",
	data : {area:"净化二班",username:"李京松"},
	dataType : "json",  
	success: function( json) {
		console.log(json);
		if (json.code == 0) {
			var datapro = json.data;
			//数据初始化
			coordinate_tree_data = buildTree(datapro);
			
			//tree
			layui.use('tree', function(){
				var tree = layui.tree
				,layer = layui.layer
				,data = coordinate_tree_data;


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
								,id: 'work_plan'+type //防止重复弹出
								,key:'id'
								,content: $("#coordinate_tree")
								,btn: ['确认',"取消"]
								,btnAlign: 'c' //按钮居中
								,yes: function(){

									var check = coordinate_tree.getChecked(); //获得被勾选的节点
									console.log(check);

									for (var i = 0; i < check.length; i++) {
										usernames += check[i][1];
										if (i!=check.length-1) {
											usernames +=",";
										}
										}
									console.log("选中的部门："+usernames);

										//workPlan(this,usernames);


									usernames="";

									layer.closeAll();
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

					$('#work_plan').on('click', function(){
						var othis = $(this), method = othis.data('method');
						active[method] ? active[method].call(this, othis) : '';
					});

				});


			});

		}

	}  
});
