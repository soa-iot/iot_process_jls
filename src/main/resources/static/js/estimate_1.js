
/**
 * 全局变量——piid
 */
var piidp = GetQueryString('piid');

/**
 * 全局变量——属地单位
 */
var area = GetQueryString('area');

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
			    //,height: '440px'
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
	,cols: [[ //表头
		{field: 'nodeExecutor', title: '处理人', width:'25%'}
		,{field: 'nodeName', title: '处理节点', width:'25%'}
		,{field: 'nodeComment', title: '处理说明', width:'25%'}
		,{field: 'nodeEndTime', title: '时间', width:'25%'} 
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