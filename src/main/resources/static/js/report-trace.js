//全局配置
layui.config({
	base: '../jsPackage/js/',
}).extend({
    excel: 'excel',
});

/**
 * 日期插件
 */
layui.use('laydate', function(){
	var laydate = layui.laydate;
	//常规用法
	laydate.render({
		elem: '#startdate'
		,format: 'yyyy-MM-dd'
	});
});

layui.use('laydate', function(){
	var laydate = layui.laydate;
	//常规用法
	laydate.render({
		elem: '#enddate'
		,format: 'yyyy-MM-dd'
	});
});


//加载layui内置模块
layui.use(['jquery','form','layer','table','excel'], function(){
	var form = layui.form
	,layer = layui.layer
	,table = layui.table
	,$ = layui.$ //使用jQuery
	var excel = layui.excel;
	
	//问题未整改和已整改
	var uncount = 0, count = 0;
	var piid;
	
	/**
	 * 问题上报信息展示表
	 */
	var problemTable = table.render({
		elem: '#reportTrace',
		method: 'post',
		url: '/iot_process/report/showproblembycondition',
		toolbar: '#toolbarBtn',
		defaultToolbar: ['filter'],
		cellMinWidth:70,
		totalRow: true,
		page: true,   //开启分页
		request: {
		    pageName: 'page' //页码的参数名称，默认：page
		    ,limitName: 'limit' //每页数据量的参数名，默认：limit
		},
		parseData: function(res){ //res 即为原始返回的数据
			var data = res.data     
	    	if(data != null || data != ''){
	    		 for(var i=0;i<data.length;i++){
	    			 data[i].applydate = data[i].applydate.replace(/T/, ' ').replace(/\..*/, '');
	    			 data[i].problemstate = (data[i].problemstate == 'FINISHED')?'已整改':'未整改';
	    			 count = res.msg;
	    			 uncount = res.count - count;
	    		 }
	    	}
			$("#count").text(count);
			$("#uncount").text(uncount);
		    return {
		      "code": res.code, //解析接口状态
		      "msg": res.msg, //解析提示文本
		      "count": res.count, //解析数据长度
		      "data": data      //解析数据列表
		    };
		},
		cols: [[{field:'id', title:'编号', width:70, sort:false, type:'numbers', fixed:'left', align:'center'},
			{field:'applydate', title:'上报日期', width:124, sort:true, align:'center'},    //, templet:"<div>{{layui.util.toDateString(d.applydate,'yyyy-MM-dd HH:mm:ss')}}</div>"
			{field:'applypeople', title:'上报人', width:130, sort:true, align:'center'},
			{field:'welName', title:'装置单元', width:120, sort:true, align:'center'},
			{field:'problemclass', title:'问题类别', width:120, sort:true, align:'center'},
			{field:'profession', title:'专业', width:90, sort:true, align:'center'},
			{field:'problemtype', title:'部门', width:90, sort:true, align:'center'},
			{field:'problemdescribe', title:'描述', width:209, sort:true, align:'center'},
			{field:'problemstate', title:'问题状态', width:100, sort:true, align:'center'},
			{fixed:'right',  title:'处理过程', width:105, align:'center', toolbar:'#barBtn'} ]]  
	});
	
	/**
	 * 监听每一行工具事件
	 */
	table.on('tool(reportTrace)', function(obj){
		console.log(obj);
	    var data = obj.data;
	    if(obj.event === 'process'){
	      piid = data.piid;
	      loadTable();
	      layer.open({
	    	title: '处理过程信息',
	    	type: 1,
	    	id: obj.event+1,
	    	btn: ['确认'],
	    	offset: '100px',
	    	area: ['80%','60%'],
	        content: $('#div-process'),
	        yes: function(index, layero){
	            layer.close(index); //如果设定了yes回调，需进行手工关闭
	          }
	      });
	       
	    }
	});
	
	/**
	 * 加载处理过程展示表
	 */
	function loadTable(){
		table.render({
			elem: '#processStep'
			,url: '/iot_process/process/nodes/historyTask/piid/'+piid //数据接口
			,parseData: function(res) { //res 即为原始返回的数据
				var data = res.data     
		    	if(data != null || data != ''){
		    		 for(var i=0;i<data.length;i++){
		    			 data[i].nodeEndTime = data[i].nodeEndTime.replace(/T/, ' ').replace(/\..*/, '');
		    		 }
		    	}
				return {
					"code": res.state, //解析接口状态
					"msg": res.message, //解析提示文本
					"count": res.length, //解析数据长度
					"data": res.data //解析数据列表
				}
			}
			,cols: [[ //表头
				{field: 'nodeExecutor', title: '处理人', width:'25%',fixed: 'left'}
				,{field: 'nodeName', title: '处理节点', width:'15%'}
				,{field: 'nodeComment', title: '处理说明', width:'40%'}
				,{field: 'nodeEndTime', title: '时间', width:'20%',fixed: 'right'} 
				]]
		});
	}
	
	/**
	 * 导出表事件
	 */
	function exportExcel(){
		//从后台取出表数据
		$.ajax({
			async: false,
			type: "POST",
			url: "/iot_process/report/showproblembycondition",
			data: {
				'welName': $("#welName").val(),
    			'problemclass': $("#problemclass").val(),
    			'profession': $("#profession").val(),
    			'problemtype': $("#problemtype").val(),
    			'problemdescribe': $("#problemdescribe").val(),
    			'problemstate': $("#problemstate").val(),
    			'startTime': $("#startdate").val(),
    			'endTime': $("#enddate").val(),
    			'schedule': $("#schedule").val(),
    			'handler': $("#handler").val()
			},
			dataType: "json",
			success: function(json){
				if(json.code == 0){
					var data = json.data     
			    	if(data != null || data != ''){
			    		 for(var i=0;i<data.length;i++){
			    			 data[i].applydate = data[i].applydate.replace(/T/, ' ').replace(/\..*/, '');
			    			 data[i].problemstate = (data[i].problemstate == 'FINISHED')?'已整改':'未整改';
			    		 }
			    	}
					 // 1. 数组头部新增表头
					data.unshift({
						applydate: '上报日期',
						applypeople: '申请人', 
						welName: '装置单元',
						problemclass: '问题类别',
						profession: '专业',
						problemtype: '部门',
						problemdescribe: '描述',
						problemstate: '问题状态',
					});
					//2. 过滤多余属性
					var exportData = excel.filterExportData(data, ['applydate', 'applypeople', 'welName', 'problemclass', 'profession', 'problemtype', 'problemdescribe', 'problemstate']);
					console.log(123);
					//3. 执行导出函数，系统会弹出弹框
					excel.exportExcel({
			            sheet1: exportData
			        }, '问题上报数据.xlsx', 'xlsx');

					//table.exportFile(problemTable.config.id,exportData, 'xls');
				}
			},
			error: function(){
				layer.msg("获取数据失败,请检查网路情况 !", {icon:2})
			}
		});	
	}
	
	/**
	 * 打开/关闭高级搜索
	 */
	var isopen = 0;
	function opneAdvanceQuery(){
		if(isopen){
			$(".layui-form-hidden").css({"display":"none"});
			$("#advance-search").text("打开高级搜索");
			isopen = 0;
		}else{
			$(".layui-form-hidden").css({"display":"block"});
			$("#advance-search").text("关闭高级搜索");
			isopen = 1;
		}
	}
	
	/**
	 * 监听头工具栏事件 
	 */ 
	  table.on('toolbar(reportTrace)', function(obj){
	     //var checkStatus = table.checkStatus(obj.config.id);
		 console.log(obj);
		 switch(obj.event){
	      case 'querydata':
	    	console.log('querydata');
	    	problemTable.reload({
	    		url: '/iot_process/report/showproblembycondition'
	    	   ,page: {
	    		   page: 1 //重新从第 1 页开始
	    	   }
	    	   ,where: {
	    			'welName': $("#welName").val(),
	    			'problemclass': $("#problemclass").val(),
	    			'profession': $("#profession").val(),
	    			'problemtype': $("#problemtype").val(),
	    			'problemdescribe': $("#problemdescribe").val(),
	    			'problemstate': $("#problemstate").val(),
	    			'startTime': $("#startdate").val(),
	    			'endTime': $("#enddate").val(),
	    			'schedule': $("#schedule").val(),
	    			'handler': $("#handler").val(),
	    			'applypeople': $("#applypeople").val()
	    	   }
	    	})
	        break;
	      case 'open-advance':
	    	  console.log('open-advance');
	    	  opneAdvanceQuery();
	    	  break;
	      case 'export':
	    	  console.log('export');
	    	  exportExcel();
	    	  break;
	      case 'delete':
	    	  console.log('delete');
	    	  layer.msg("功能正在完善中...",{icon: 5})
	    };
	  });
	
})