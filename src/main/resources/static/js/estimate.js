
/**
 * 地址解析
 * @returns
 */

function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  decodeURI(r[2]); return null;
}

/**
 * 全局变量——piid
 */
var piidp = GetQueryString('piid');

/**
 * 全局变量——属地单位
 */
var area = GetQueryString('area');
//console.log(era+","+piidp);

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
			,arrow: 'always'
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
			var mode = imgs.length%3;
			var img_id = 0;
			//alert(img[i]);

			for (var j = 0; j < Math.ceil(imgs.length/3); j++) {
				var img_div='<div>';
				if (mode != 0 && j == (Math.ceil(imgs.length/3) - 1) ) {
					//img_div = '';

					for (var i = 0; i < mode; i++) {
						img_div = img_div+'<img alt="图片1" src="'+imgs[img_id].phoAddress+'">';
						img_id++;
					}

				}else{

					for (var i = 0; i < 3; i++) {
						img_div = img_div+'<img alt="图片1" src="'+imgs[img_id].phoAddress+'">';
						img_id++;
					}

				}
				img_div = img_div+'</div>'
				$("#imag").append(img_div);
			}
		}

	}  
});



/**
 * 作业安排
 * @param obj
 * @returns
 */
var usernames="";
	//如果为这个几个部门这显示全厂人员
		//var era = "生产办公室";
		var url = area=='生产办公室' || area == 'HSE办公室' || area == '设备办公室'?'../html/organization_tree.html':'../html/organization_tree_problemtype.html?era='+area;
	console.log(area);
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
							console.log(usernames);

							workPlan(this,usernames);
							usernames="";
							
							layer.closeAll();
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
	
	/*if ($(this).attr("id")=="work_plan") {
		if (rolena=="生产办公室" || rolena == "HSE办公室" || rolena == "设备办公室") {
			//workPlanBtnAll(this);
		}else{
			//workPlanBtn(this);
			
		}
		
	}*/
	
	if ($(this).html()=="回退" || $(this).html()=="闭环处理") {
		//验证处理说明不能为空
		if ($("#comment").val()=="") {
			layer.msg('处理说明不能为空！！！');
		}else{
			modifyEstimated(this);
		}
	}else{
		//modifyEstimated(this);
	}

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
	var date_amtch = period.match(/^(\d{4})(-)(\d{2})(-)(\d{2})$/);

	//日期格式处理
	if (period == "") {
		str = str.replace(/rectificationperiod=(\d+-\d+-\d+)/,period);
	}else{
		period = period.replace(/-/g, "/");
		str = str.replace(/rectificationperiod=(\d+-\d+-\d+)/,"rectificationperiod="+period);
	}

	if (($("#sele").val() =="指定日期" && period=="") || ($("#sele").val() =="指定日期" && date_amtch == null)) {
		layer.msg('请正确输入指定日期！！！');
	}else if(problem_describe == ""){
		layer.msg('问题描述不能为空！！！');
	}else{
		$.ajax({  
			url : "/iot_process/estimates/modifyestimated",  
			type : "post",
			data : str,
			dataType : "json",  
			success: function( json) {

				if (json.state==0) {
					if ($(obj).html()=="回退" || $(obj).html()=="闭环处理") {
						layer.msg(json.message);
					}

				}
			}  
		});
	}

}

/**
 * 作业安排确认提交
 * 
 * @param obj 当前对象
 * @param usernames 人名用“，”隔开
 * @returns
 */
function workPlan(obj,usernames){
	var isIngroup;
	if($(obj).attr("id")=="work_plan"){
		isIngroup=1;
		}else if ($(obj).attr("id")=="coordinate" && $("#problemtype").val()!="维修工段" && $("#problemtype").val()!="净化工段") {
			isIngroup=2;
		}
	//console.log(isIngroup);
	
$.ajax({
    type: "PUT"
    ,url: '/iot_process/process/nodes/next/'+piidp    //piid为流程实例id
    ,data: {
    	"isIngroup": isIngroup,    /*流程变量名称,流程变量值(属地单位为非维修非净化+前端选择"作业安排"时，值为1；
		     								   属地单位为非维修非净化+前端选择"外部协调"时，值为2；
		     								   属地单位为维修或净化+前端选择"作业安排"时，值为1；
		     								    属地单位为维修或净化+前端选择"下一步"时，值为3 )*/
    	"comment": $("comment").val(),     //节点的处理信息
    	"estimators":usernames
    	
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

/**
 * 处理过程表格
 */
layui.use('table', function(){
	  var table = layui.table;
	  
	  //第一个实例
	  table.render({
	    elem: '#process'
	    //,height: 200
	    //,width:'90%'
	    ,url: '/iot_process/process/nodes/historyTask/piid/processPure2:3:32523' //数据接口
	   // ,page: true //开启分页
	    ,parseData: function(res) { //res 即为原始返回的数据
            return {
                "code": res.state, //解析接口状态
                "msg": res.message, //解析提示文本
                "count": res.length, //解析数据长度
                "data": res.data //解析数据列表
            }
        }
	    ,cols: [[ //表头
	      {field: 'nodeExecutor', title: '处理人', width:'25%'}
	      ,{field: 'nodeName', title: '处理节点', width:'25%'}
	      ,{field: 'nodeComment', title: '处理说明', width:'25%'}
	      ,{field: 'nodeEndTime', title: '时间', width:'25%'} 
	    ]]
	  });
	  
	});