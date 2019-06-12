
/**
 * 全局变量——piid
 */
var piidp = GetQueryString('piid');

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
					,content: '<iframe id="addFrame" src="'+url+'" style="width:293px;height:290px;"></iframe>'
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
								usernames +=user;
								if (i!=checkData.length-1) {
									usernames +=",";
								}
							}
						}
						console.log(usernames=="");
	
						if (usernames=="") {
							layer.msg('至少选定一人！！！');
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

//数据初tree数据声明
var coordinate_tree_data=[];
$.ajax({  
	url : "http://localhost:8080/iot_process/estimates/problemtype",  
	type : "get",
	data : {problemtype:area},
	dataType : "json",  
	success: function( json) {
		//console.log(json.state);
		if (json.state == 0) {
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
								,id: 'coordinate'+type //防止重复弹出
								,key:'id'
									,content: $("#coordinate_tree")
									,btn: ['确认',"取消"]
								,btnAlign: 'c' //按钮居中
									,yes: function(){

										var check = coordinate_tree.getChecked(); //获得被勾选的节点

										for (var i = 0; i < check.length; i++) {
											usernames += check[i][0].innerText;
											if (i!=check.length-1) {
												usernames +=",";
											}
										}

										workPlan(this,usernames);

										console.log(usernames);

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

					$('#coordinate').on('click', function(){
						var othis = $(this), method = othis.data('method');
						active[method] ? active[method].call(this, othis) : '';
					});

				});


			});

		}

	}  
});

/**
 * 指定日期禁用
 */
$("#sele").change(function(){
	if ($("#sele").val()=="大修时整改") {
		$("#sdate").val("");
		$("#sdate").attr("disabled","disabled");
		$("#sdateall").hide()
	}else{
		$("#sdateall").show()
		$("#sdate").removeAttr("disabled");
	}
});

/**
 * 问题处理储存
 */

//var rolena="生产办公室";
$(".problem_describe").click(function(){

	console.log(yesCompare());
	if ($(this).html()=="回退" || $(this).html()=="闭环处理") {
		//验证处理说明不能为空
		if (yesCompare()) {
			modifyEstimated(this);
			//layer.msg('处理说明不能为空！！！');
		}
	}else{
		//modifyEstimated(this);
	}

});

/**
 * 作业安排确认提交
 * 
 * @param obj 当前对象
 * @param usernames 人名用“，”隔开
 * @returns
 */
function workPlan(obj,usernames){
	/*var isIngroup;
	if($(obj).attr("id")=="work_plan"){
		isIngroup=1;
		}else if ($(obj).attr("id")=="coordinate" && $("#problemtype").val()!="维修工段" && $("#problemtype").val()!="净化工段") {
			isIngroup=2;
		}*/
	//console.log($("#comment").val());

	$.ajax({
		type: "PUT"
			,url: '/iot_process/process/nodes/next/'+piidp    //piid为流程实例id
			,data: {
				"isIngroup": "1",    /*流程变量名称,流程变量值(属地单位为非维修非净化+前端选择"作业安排"时，值为1；
		     								   属地单位为非维修非净化+前端选择"外部协调"时，值为2；
		     								   属地单位为维修或净化+前端选择"作业安排"时，值为1；
		     								    属地单位为维修或净化+前端选择"下一步"时，值为3 )*/
				"comment": $("#comment").val(),     //节点的处理信息
				"receivor":usernames,
				"userName":$.cookie("name")
			}   //问题上报表单的内容
	,contentType: "application/x-www-form-urlencoded"
		,dataType: "json"
			,success: function(jsonData){
				//后端返回值： ResultJson<Boolean>
				if (jsonData.data) {
					modifyEstimated(this);
				}
			},
			//,error:function(){}		       
	});
}

/**
 * 判断是人还是部门
 * @returns是人返回人名，是部门返回空串
 */
function userOrDept(checData){
	var u = checData.split(",");
	if (u[1]==1) {
		return u[0];
	}else{
		return ""
	}
}
