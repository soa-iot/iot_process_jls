/**
 * 作业指派
 */

/**
 * 全局变量——piid
 */
var piidp = GetQueryString('piid');

/**
 * 全局变量——属地单位
 */
var area = GetQueryString('area');

/**
 * 作业安排
 * @param obj
 * @returns
 */
var usernames="";
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
				,content: '<iframe frameborder="no" id="addFrame" src="../html/organization_tree_problemtype.html?area='+area+'" style="width:98%;height:98%;"></iframe>'
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
								if (i<checkData.length-2) {
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
							//workPlan(this,usernames);
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
